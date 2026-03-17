'use client';

import { signInMagicLink } from '@/lib/actions/auth';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

export default function MagicLinkLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInMagicLink({ email });

    if (result.success) {
      router.push('/auth/check-email');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="email">Email address</FieldLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </Field>

      {error && <FieldError errors={[{ message: error }]} />}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Sending...' : 'Send Magic Link'}
      </Button>
    </form>
  );
}
