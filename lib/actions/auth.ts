import { redirect } from 'next/navigation';
import { magicLinkFormSchema } from '@/lib/validations';
import { MagicLinkSignInSchema } from '@/lib/validations/magicLinkSignIn';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/lib/constants/routes';

export type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

export const signInWithGoogle = async (): Promise<ActionResult> => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.AUTH_CALLBACK}`,
    },
  });

  if (error) return { success: false, error: error.message };

  if (data.url) redirect(data.url);
  return { success: true };
};

export const signInMagicLink = async (formData: MagicLinkSignInSchema): Promise<ActionResult> => {
  const parsed = magicLinkFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.AUTH_CALLBACK}`,
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
};

