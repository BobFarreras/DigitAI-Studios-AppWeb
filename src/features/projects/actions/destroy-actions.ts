'use server';

import { requireAdmin } from '@/lib/auth/admin-guard';
import { DestructionService, DestructionResult } from '@/services/factory/DestructionService';
import { revalidatePath } from 'next/cache';
// ✅ CORRECCIÓ 1: Importar redirect des de next/navigation
import { redirect } from 'next/navigation';

export type DestroyState = {
  message: string;
  errors?: string[];
  success: boolean;
  details?: DestructionResult;
};

export async function destroyProjectAction(
  prevState: DestroyState, 
  formData: FormData
): Promise<DestroyState> {
  await requireAdmin();

  const repoName = formData.get('repoName') as string;
  const confirmation = formData.get('confirmation') as string;

  if (confirmation !== 'SI') {
    return { 
      success: false, 
      message: "Confirmació incorrecta. Has d'escriure 'SI' en majúscules." 
    };
  }

  if (!repoName) {
    return { success: false, message: "Falta el nom del repositori." };
  }

  try {
    const service = new DestructionService();
    // Aquest mètode retorna un objecte amb els logs, no llança error si tot va bé
    const result = await service.destroyClient(repoName);

    console.log("DESTRUCCIÓ COMPLETADA:", result);

  } catch (error: unknown) {
    // Si l'error és una instància d'Error, n'agafem el missatge
    const msg = error instanceof Error ? error.message : 'Error desconegut';
    return { success: false, message: msg };
  }

  // ✅ CORRECCIÓ 2: El redirect es fa FORA del try/catch
  // Si arribem aquí, és que no hi ha hagut errors al catch.
  revalidatePath('/admin/projects');
  
  // El redirect llança un error intern (NEXT_REDIRECT), així que tècnicament "surt" de la funció aquí.
  redirect('/admin/projects?destroyed=true');
  
  // TypeScript pot queixar-se que "falta el return" si no detecta que redirect és terminal.
  // Aquest return mai s'executarà, però satisfà al compilador estricte:
  return { success: true, message: "Redirigint..." }; 
}