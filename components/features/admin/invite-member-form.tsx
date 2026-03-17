'use client';

import { useState } from 'react';
import { inviteMember } from '@/lib/actions/onboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from '@/components/ui/field';

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
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@example.com"
          required
          className="flex-1"
        />
        <Select value={role} onValueChange={(v) => setRole(v as 'technician' | 'client_user')}>
          <SelectTrigger className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client_user">Client User</SelectItem>
            <SelectItem value="technician">Technician</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading || !email} className="shrink-0">
          {loading ? 'Sending...' : 'Send invite'}
        </Button>
      </div>

      {error && <FieldError errors={[{ message: error }]} />}
      {success && <p className="text-sm text-emerald-600">✓ Invite has been successfully sent</p>}
    </form>
  );
}
