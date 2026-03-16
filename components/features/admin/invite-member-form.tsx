'use client';

import { useState } from 'react';
import { inviteMember } from '@/lib/actions/onboarding';

type Props = { activeOrgId: string };

export function InviteMemberForm({ activeOrgId }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'technician' | 'client_user'>('client_user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await inviteMember({ email, role, orgId: activeOrgId });

    if (result.success) {
      setSuccess(true);
      setEmail('');
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@example.com"
          required
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'technician' | 'client_user')}
          className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="client_user">Client User</option>
          <option value="technician">Technician</option>
        </select>
        <button
          type="submit"
          disabled={loading || !email}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          {loading ? 'Sending...' : 'Send invite'}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">✓ Invite sent to {email}</p>}
    </form>
  );
}
