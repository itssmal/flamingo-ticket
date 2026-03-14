import { PageLoading } from '@/components/layout/page-loading';
import { Skeleton } from '@/components/ui/skeleton';

export default function LayoutLoading() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar skeleton */}
      <aside className="w-60 flex flex-col border-r bg-card shrink-0">
        <div className="p-4 border-b space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </nav>
        <div className="p-2">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div className="p-2 border-t">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar skeleton */}
        <header className="h-14 border-b bg-card flex items-center justify-end gap-2 px-4 shrink-0">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex items-center gap-2 pl-2 border-l">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="hidden sm:block space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md ml-2" />
          </div>
        </header>

        {/* Main content: centered loading animation */}
        <main className="flex-1 overflow-y-auto p-6">
          <PageLoading />
        </main>
      </div>
    </div>
  );
}
