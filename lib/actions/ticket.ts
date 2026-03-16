'use server';

import {
  createTicketSchema,
  CreateTicketSchema,
  updateTicketSchema,
  UpdateTicketSchema,
} from '@/lib/validations/ticket';
import { ActionResult } from '@/lib/actions/auth';
import { Ticket } from '@/types';
import { createClient } from '@/lib/supabase/server';

export async function createTicket(formData: CreateTicketSchema): Promise<ActionResult<Ticket>> {
  const parsed = createTicketSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('tickets')
    .insert({
      ...parsed.data,
      creator_id: user.id,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function updateTicket(id: string, formData: UpdateTicketSchema): Promise<ActionResult<Ticket>> {
  const parsed = updateTicketSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tickets')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function deleteTicket(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from('tickets').delete().eq('id', id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}
