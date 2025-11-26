import { createBrowserClient } from '@supabase/ssr'
// 👇 Importa els tipus
import { Database } from '@/types/database.types' 

export function createClient() {
  // 👇 Afegeix el genèric <Database> aquí
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}