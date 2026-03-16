import z from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be under 200 characters'),
  description: z.string().max(5000, 'Description must be under 5000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignee_id: z.uuid().optional().nullable(),
  organization_id: z.uuid(),
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = createTicketSchema.partial().extend({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
});

export type UpdateTicketSchema = z.infer<typeof updateTicketSchema>;

export const ticketFiltersSchema = z.object({
  status: z.enum(['all', 'open', 'in_progress', 'resolved', 'closed']).optional().default('all'),
  priority: z.enum(['all', 'low', 'medium', 'high', 'urgent']).optional().default('all'),
  assignee_id: z.string().optional().default('all'),
  search: z.string().optional().default(''),
  page: z.coerce.number().min(1).optional().default(1),
  per_page: z.coerce.number().min(1).max(100).optional().default(20),
  sort_by: z.enum(['created_at', 'updated_at', 'priority', 'status']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TicketFiltersSchema = z.infer<typeof ticketFiltersSchema>;

export function parseTicketFilters(params: Record<string, string | string[] | undefined>): TicketFiltersSchema {
  return ticketFiltersSchema.parse({
    status: params.status ?? 'all',
    priority: params.priority ?? 'all',
    assignee_id: params.assignee_id ?? 'all',
    search: params.search ?? '',
    page: params.page ?? '1',
    per_page: params.per_page ?? '20',
    sort_by: params.sort_by ?? 'created_at',
    sort_order: params.sort_order ?? 'desc',
  });
}
