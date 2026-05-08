'use server';
/**
 * @file src/actions/projects-seeding.ts
 * @updated 2026-05-08
 * @summary Seeding de productes d'exemple per nous projectes.
 * @scope Insercio controlada a DB per catalegs inicials segons sector.
 */

import { randomUUID } from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';

interface SeedItem {
  name: string;
  desc: string;
  price: number;
  img: string;
}

export async function seedProducts(supabase: SupabaseClient, orgId: string, sector: string) {
  const products = getProductsBySector(sector, orgId);
  const { error } = await supabase.from('products').insert(products);
  if (error) {
    console.error('⚠️ Error fent seeding:', error.message);
  } else {
    console.log(`✅ Seeding correcte: ${products.length} productes creats.`);
  }
}

function getProductsBySector(sector: string, orgId: string) {
  const common = { organization_id: orgId, currency: 'EUR', stock: 50, active: true };
  const catalogs: Record<string, SeedItem[]> = {
    restaurant: [
      { name: 'Menú Degustació', desc: 'Experiència gastronòmica completa.', price: 45.0, img: 'https://images.unsplash.com/photo-1544025162-d76690b67f11?auto=format&fit=crop&w=800' },
      { name: 'Vi de la Casa', desc: 'Selecció del sommelier.', price: 18.5, img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800' },
      { name: 'Postres Artesans', desc: 'Fets al dia.', price: 8.0, img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800' },
      { name: 'Còctel Especial', desc: 'Per acabar la vetllada.', price: 12.0, img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800' },
    ],
    fashion: [
      { name: 'Jaqueta Premium', desc: 'Disseny exclusiu.', price: 89.9, img: 'https://images.unsplash.com/photo-1551028919-ac66e6a39d44?auto=format&fit=crop&w=800' },
      { name: 'Samarreta Cotó', desc: '100% orgànica.', price: 29.9, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800' },
      { name: 'Bossa de Pell', desc: 'Feta a mà.', price: 120.0, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800' },
      { name: 'Ulleres de Sol', desc: 'Protecció UV.', price: 45.0, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800' },
    ],
    services: [
      { name: 'Consultoria 1h', desc: 'Sessió estratègica.', price: 100.0, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800' },
      { name: 'Auditoria Web', desc: 'Anàlisi complet.', price: 250.0, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800' },
      { name: 'Pack Inici', desc: 'Tot per començar.', price: 500.0, img: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800' },
      { name: 'Suport Mensual', desc: 'Manteniment inclòs.', price: 50.0, img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800' },
    ],
  };

  const selectedCatalog = catalogs[sector] || catalogs.services;
  return selectedCatalog.map((item, index) => ({
    ...common,
    slug: `prod-${index}-${randomUUID().substring(0, 8)}`,
    name: item.name,
    description: item.desc,
    price: item.price,
    images: [item.img],
  }));
}
