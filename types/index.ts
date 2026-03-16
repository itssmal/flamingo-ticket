import { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

export type TypedSupabaseClient = SupabaseClient<Database>;
export type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];

export type UserRole = Database['public']['Enums']['user_role'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
