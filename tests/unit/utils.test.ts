import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils' // Assegura't que aquesta importació és correcta segons el teu projecte

describe('Utils: cn (className merge)', () => {
  it('hauria de combinar classes normals', () => {
    const result = cn('bg-red-500', 'text-white')
    expect(result).toBe('bg-red-500 text-white')
  })

  it('hauria de resoldre conflictes de Tailwind (l\'últim guanya)', () => {
    // Si fas servir tailwind-merge, p-4 hauria de guanyar a p-2
    const result = cn('p-2', 'p-4')
    expect(result).toContain('p-4')
    expect(result).not.toContain('p-2')
  })

  it('hauria de gestionar condicionals i valors falsy', () => {
    const isTrue = true
    const isFalse = false
    
    const result = cn(
      'base-class',
      isTrue && 'visible',
      isFalse && 'hidden',
      null,
      undefined
    )
    
    expect(result).toBe('base-class visible')
  })
})