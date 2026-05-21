/**
 * @file src/app/[locale]/loading.tsx
 * @updated 2026-05-21
 * @summary Global loading skeleton for locale-scoped routes.
 * @scope Suspense fallback shown while server content streams in.
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    </div>
  );
}