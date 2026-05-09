/**
 * @file src/components/admin/socials/social-post-card/SocialPostCardHeader.tsx
 * @updated 2026-05-09
 * @summary Capçalera de targeta social amb plataforma i selector d'estat.
 * @scope Render visual de metadades i canvi d'estat.
 */
'use client';

import { cn } from '@/lib/utils';

interface Props {
  platform: string;
  icon: string;
  textClassName: string;
  status: string;
  statusClassName: string;
  isPublishing: boolean;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SocialPostCardHeader({
  platform,
  icon,
  textClassName,
  status,
  statusClassName,
  isPublishing,
  onStatusChange,
}: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
      <div className="flex items-center gap-2.5">
        <div className="text-xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform">{icon}</div>
        <span className={cn('font-bold text-sm tracking-wide capitalize', textClassName)}>{platform}</span>
      </div>
      <div className="relative z-10">
        <select
          value={status}
          onChange={onStatusChange}
          disabled={isPublishing}
          className={cn(
            'appearance-none pl-3 pr-8 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none transition-all hover:brightness-95 shadow-sm border',
            statusClassName,
          )}
        >
          <option value="draft" className="text-gray-900 bg-white">Draft</option>
          <option value="approved" className="text-gray-900 bg-white">Approved</option>
          <option value="published" className="text-gray-900 bg-white">Published</option>
          <option value="failed" className="text-gray-900 bg-white">Failed</option>
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor" className="text-current">
            <path d="M4 6L0 0H8L4 6Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
