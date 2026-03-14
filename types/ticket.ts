import { Organization, Profile, Ticket, TicketPriority, TicketStatus } from '@/types';

export type TicketFilters = {
  status?: TicketStatus | 'all';
  priority?: TicketPriority | 'all';
  assignee_id?: string | 'all';
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'status';
  sort_order?: 'asc' | 'desc';
};

export type TicketWithRelations = Ticket & {
  assignee: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'email'> | null;
  creator: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'email'>;
  organization: Pick<Organization, 'id' | 'name' | 'slug'>;
  _count?: {
    comments: number;
  };
};
