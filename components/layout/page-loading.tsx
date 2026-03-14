export function PageLoading() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-6 animate-in fade-in duration-300"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="text-6xl animate-float select-none"
        role="img"
        aria-hidden
      >
        🦩
      </span>
      <p className="text-muted-foreground text-sm font-medium animate-fade-soft">
        Loading…
      </p>
    </div>
  );
}
