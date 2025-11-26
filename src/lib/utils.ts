import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes de CSS de manera intel·ligent.
 * Soluciona conflictes de Tailwind automàticament.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}