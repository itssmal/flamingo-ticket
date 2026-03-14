'use client';

import { useState } from 'react';
import { completeOnboarding } from '@/lib/actions/onboarding';

interface OnboardingFormProps {
  defaultEmail: string;
  defaultName: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48);
}

export function OnboardingForm({ defaultEmail, defaultName }: OnboardingFormProps) {
  const [fullName, setFullName] = useState(defaultName);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOrgNameChange(value: string) {
    setOrgName(value);
    if (!slugManuallyEdited) {
      setOrgSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setOrgSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await completeOnboarding({
      full_name: fullName,
      org_name: orgName,
      org_slug: orgSlug,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // On success, server action redirects to /dashboard
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-8 space-y-6 shadow-sm">
      {/* Step 1 — Your details */}
      <div className="space-y-1">
        <h2 className="font-semibold">Your details</h2>
        <p className="text-sm text-muted-foreground">How should we address you?</p>
      </div>

      <div className="space-y-4">
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
            Full name <span className="text-destructive">*</span>
          </label>
          <input
            id="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <hr className="border-border" />

      {/* Step 2 — Organization */}
      <div className="space-y-1">
        <h2 className="font-semibold">Your organization</h2>
        <p className="text-sm text-muted-foreground">You&apos;ll be the admin of this workspace.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="org_name" className="text-sm font-medium">
            Organization name <span className="text-destructive">*</span>
          </label>
          <input
            id="org_name"
            type="text"
            value={orgName}
            onChange={(e) => handleOrgNameChange(e.target.value)}
            placeholder="Acme Corp"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="org_slug" className="text-sm font-medium">
            URL slug <span className="text-destructive">*</span>
          </label>
          <div className="flex rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <span className="bg-muted px-3 py-2 text-sm text-muted-foreground border-r shrink-0">flamingo.app/</span>
            <input
              id="org_slug"
              type="text"
              value={orgSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="acme-corp"
              required
              pattern="[a-z0-9-]+"
              className="flex-1 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens only.</p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={loading || !fullName || !orgName || !orgSlug}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Setting up...' : 'Create organization →'}
      </button>
    </form>
  );
}
