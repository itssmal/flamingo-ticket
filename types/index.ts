import { Database } from '@/types/database';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
