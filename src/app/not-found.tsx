'use client';
import Link from 'next/link';

// This handles 404s that happen outside of the [locale] structure
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center font-sans">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-8">Page not found.</p>
          {/* Hard navigation to root to attempt recovery */}
          <Link href="/" className="underline hover:text-purple-500">
            Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}