/**
 * @file src/app/global-error.tsx
 * @updated 2026-05-21
 * @summary Global error boundary — catches unhandled errors in root layout.
 * @scope Must be a Client Component. Own <html>/<body> since root layout is skipped on error.
 */
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error.digest ?? error.message, error.stack);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-black dark:text-white" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center font-sans">
          <h1 className="text-4xl font-bold mb-2">500</h1>
          <p className="mb-6 text-muted-foreground">Something went wrong.</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}