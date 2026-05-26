/**
 * @file src/app/[locale]/dashboard/loading.tsx
 * @updated 2026-05-21
 * @summary Dashboard loading skeleton.
 * @scope Suspense fallback for dashboard routes.
 */
export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    </div>
  );
}