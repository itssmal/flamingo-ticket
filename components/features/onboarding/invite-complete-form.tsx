'use client';

import { useState } from 'react';
import { completeInvite } from '@/lib/actions/onboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

interface InviteCompleteFormProps {
  defaultEmail: string;
  defaultName: string;
}

export function InviteCompleteForm({ defaultEmail, defaultName }: InviteCompleteFormProps) {
  const [fullName, setFullName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await completeInvite({ full_name: fullName });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-8 space-y-5 shadow-sm">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" value={defaultEmail} disabled readOnly autoComplete="off" />
      </Field>

      <Field>
        <FieldLabel htmlFor="full_name">
          Your name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Smith"
          required
          autoFocus
        />
      </Field>

      {error && <FieldError errors={[{ message: error }]} />}

      <Button type="submit" disabled={loading || !fullName} className="w-full">
        {loading ? 'Joining...' : 'Go to dashboard →'}
      </Button>
    </form>
  );
}
