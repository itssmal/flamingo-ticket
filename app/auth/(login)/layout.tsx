export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">🦩</h1>
          <h1 className="text-3xl font-bold tracking-tight">tickets</h1>
          <p className="text-muted-foreground">Sign in to the portal</p>
        </div>

        {children}
      </div>
    </div>
  );
}
