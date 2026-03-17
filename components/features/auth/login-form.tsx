'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLogin } from '@/components/features/auth/google-login';
import MagicLinkLogin from '@/components/features/auth/magic-link-login';

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <GoogleLogin />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <MagicLinkLogin />
        </CardContent>
      </Card>
    </div>
  );
}
