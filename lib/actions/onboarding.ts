'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import type { ActionResult } from './auth';
import { ROUTES } from '@/lib/constants/routes';

const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  org_name: z.string().min(2, 'Organization name must be at least 2 characters'),
  org_slug: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

const inviteCompleteSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
});

const inviteMemberSchema = z.object({
  email: z.email('Please enter a valid email address'),
  role: z.enum(['technician', 'client_user']),
  orgId: z.string(),
});

export async function completeOnboarding(formData: z.infer<typeof onboardingSchema>): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const admin = createAdminClient();

  // Check slug uniqueness
  const { data: existing } = await admin
    .from('organizations')
    .select('id')
    .eq('slug', parsed.data.org_slug)
    .maybeSingle();

  if (existing) {
    return { success: false, error: 'This slug is already taken.' };
  }

  // Create org
  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({
      name: parsed.data.org_name,
      slug: parsed.data.org_slug,
    })
    .select('id')
    .single();

  if (orgError || !org) {
    return { success: false, error: orgError?.message ?? 'Failed to create organization' };
  }

  // Create profile
  const { error: profileError } = await admin.from('profiles').insert({
    id: user.id,
    email: user.email!,
    full_name: parsed.data.full_name,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    role: 'client_user',
  });

  if (profileError) {
    // Rollback org if profile fails
    await admin.from('organizations').delete().eq('id', org.id);
    return { success: false, error: profileError.message };
  }

  // Create membership
  const { error: memberError } = await admin.from('organization_members').insert({
    user_id: user.id,
    organization_id: org.id,
  });

  if (memberError) {
    // Rollback both
    await admin.from('organizations').delete().eq('id', org.id);
    await admin.from('profiles').delete().eq('id', user.id);
    return { success: false, error: memberError.message };
  }

  redirect(ROUTES.DASHBOARD);
}

// ─── Complete invite (invited user setting their name) ────────

export async function completeInvite(formData: z.infer<typeof inviteCompleteSchema>): Promise<ActionResult> {
  const parsed = inviteCompleteSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Role and org come from the invite metadata set when admin sent the invite
  const role = user.user_metadata?.role;
  const organization_id = user.user_metadata?.organization_id;

  if (!role || !organization_id) {
    return { success: false, error: 'Invalid invite. Please request a new one from your admin.' };
  }

  const admin = createAdminClient();

  // Mark invite as accepted
  await admin
    .from('invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('email', user.email!)
    .eq('organization_id', organization_id)
    .is('accepted_at', null);

  // Create profile (no organization_id column on profiles — membership is via organization_members)
  const { error: profileError } = await admin.from('profiles').insert({
    id: user.id,
    email: user.email!,
    full_name: parsed.data.full_name,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    role,
  });

  if (profileError) return { success: false, error: profileError.message };

  // Create membership
  const { error: memberError } = await admin.from('organization_members').insert({
    user_id: user.id,
    organization_id,
  });

  if (memberError) {
    await admin.from('profiles').delete().eq('id', user.id);
    return { success: false, error: memberError.message };
  }

  redirect(ROUTES.DASHBOARD);
}

// ─── Invite a member (admin only) ────────────────────────────

export async function inviteMember(formData: z.infer<typeof inviteMemberSchema>): Promise<ActionResult> {
  const parsed = inviteMemberSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Only admins can invite members.' };
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', parsed.data.email)
    .maybeSingle();

  if (existingProfile) {
    return { success: false, error: 'This person is already a member of your organization.' };
  }

  const { data: existingInvite } = await supabase
    .from('invites')
    .select('id')
    .eq('email', parsed.data.email)
    .is('accepted_at', null)
    .maybeSingle();

  if (existingInvite) {
    return { success: false, error: 'An invite has already been sent to this email.' };
  }

  const adminClient = createAdminClient();

  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: {
      role: parsed.data.role,
      organization_id: parsed.data.orgId,
    },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/invite-callback`,
  });

  if (inviteError) return { success: false, error: inviteError.message };

  // Record the invite
  const { error: recordError } = await supabase.from('invites').insert({
    email: parsed.data.email,
    role: parsed.data.role,
    organization_id: parsed.data.orgId,
    invited_by: user.id,
  });

  if (recordError) return { success: false, error: recordError.message };

  return { success: true };
}
