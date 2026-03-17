'use client';

import { useState } from 'react';
import { completeOnboarding } from '@/lib/actions/onboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field';

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
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" value={defaultEmail} disabled readOnly autoComplete="off" />
        </Field>

        <Field>
          <FieldLabel htmlFor="full_name">
            Full name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
            required
          />
        </Field>
      </div>

      <hr className="border-border" />

      {/* Step 2 — Organization */}
      <div className="space-y-1">
        <h2 className="font-semibold">Your organization</h2>
        <p className="text-sm text-muted-foreground">You&apos;ll be the admin of this workspace.</p>
      </div>

      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="org_name">
            Organization name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="org_name"
            type="text"
            value={orgName}
            onChange={(e) => handleOrgNameChange(e.target.value)}
            placeholder="Acme Corp"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="org_slug">
            URL slug <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="flex rounded-lg border overflow-hidden focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="bg-muted px-2.5 py-1 text-sm text-muted-foreground border-r shrink-0 flex items-center">
              flamingo.app/
            </span>
            <Input
              id="org_slug"
              type="text"
              value={orgSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="acme-corp"
              required
              pattern="[a-z0-9-]+"
              className="border-0 rounded-none focus-visible:ring-0 focus-visible:border-0"
            />
          </div>
          <FieldDescription>Lowercase letters, numbers, and hyphens only.</FieldDescription>
        </Field>
      </div>

      {error && <FieldError errors={[{ message: error }]} />}

      <Button type="submit" disabled={loading || !fullName || !orgName || !orgSlug} className="w-full">
        {loading ? 'Setting up...' : 'Create organization →'}
      </Button>
    </form>
  );
}
