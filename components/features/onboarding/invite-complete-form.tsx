"use client";

import { useState } from "react";
import { completeInvite } from "@/lib/actions/onboarding";

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
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={defaultEmail}
          disabled
          className="w-full rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="full_name" className="text-sm font-medium">
          Your name <span className="text-destructive">*</span>
        </label>
        <input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Smith"
          required
          autoFocus
          className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !fullName}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Joining..." : "Go to dashboard →"}
      </button>
    </form>
  );
}
