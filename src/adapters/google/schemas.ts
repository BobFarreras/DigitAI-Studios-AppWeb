import { z } from 'zod';

// 1. Esquema per a una mètrica individual (Audit)
export const LighthouseAuditSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  score: z.number().nullable().optional(),
  displayValue: z.string().optional(),
  numericValue: z.number().optional(),
  // Utilitzem .catch() o .optional() per evitar trencaments si ve alguna cosa rara
  details: z.record(z.string(), z.unknown()).optional(), 
});

// 2. Esquema per a les Categories
const CategorySchema = z.object({
  score: z.number().nullable().optional(),
});

// 3. Esquema Principal de la Resposta de Google
export const PageSpeedResponseSchema = z.object({
  lighthouseResult: z.object({
    categories: z.object({
      performance: CategorySchema.optional(),
      seo: CategorySchema.optional(),
      accessibility: CategorySchema.optional(),
      'best-practices': CategorySchema.optional(),
    }),
    // ⚠️ CORRECCIÓ CRÍTICA AQUÍ 👇
    // Definim explícitament que la CLAU és un string
    audits: z.record(z.string(), LighthouseAuditSchema),
  }),
});

// Exportem el tipus inferit
export type PageSpeedResponse = z.infer<typeof PageSpeedResponseSchema>;