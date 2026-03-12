'use client';

import { signInMagicLink } from '@/lib/actions/auth';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MagicLinkLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: SubmitEvent) => {
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
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
}
