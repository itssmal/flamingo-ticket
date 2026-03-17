import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function Page() {
  return (
    <div className="rounded-lg border bg-card p-8 text-center space-y-3 shadow-sm">
      <div className="text-4xl">📬</div>
      <h2 className="text-lg font-semibold">Please check your email</h2>
      <p className="text-sm text-muted-foreground">We've sent a magic link to your email</p>
      <Link href={ROUTES.LOGIN} className="text-sm text-primary hover:underline">
        Use a different email
      </Link>
    </div>
  );
}
