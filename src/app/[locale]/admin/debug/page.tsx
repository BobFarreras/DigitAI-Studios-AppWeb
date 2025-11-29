'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Definim una interfície simple per al resultat que esperem de Supabase
interface SupabaseCountResult {
  count: number | null;
  error: {
    message: string;
    code?: string;
  } | null;
}

export default function DebugAnalyticsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [envStatus] = useState({
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  // 1. Comprovem variables només carregar
  // Eliminat useEffect perquè la inicialització es fa directament a useState

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} > ${msg}`]);

  const testConnection = async () => {
    addLog('🚀 INICIANT TEST...');
    
    // Validació prèvia
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      addLog('❌ ERROR FATAL: Falta NEXT_PUBLIC_SUPABASE_URL');
      return;
    }

    try {
      addLog('1. Creant client Supabase...');
      const supabase = createClient();
      
      addLog('2. Enviant petició (SELECT)...');
      
      // Fem un timeout manual per si es queda penjat
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: La xarxa està bloquejada (AdBlock?)")), 5000)
      );

      const dbPromise = supabase
        .from('analytics_events')
        .select('count', { count: 'exact', head: true });

      // Cursa entre la DB i el Timeout. Forcem el tipus a 'unknown' primer i després al nostre tipus.
      const result = await Promise.race([dbPromise, timeoutPromise]) as unknown as SupabaseCountResult;

      if (result.error) {
        addLog(`❌ ERROR DB: ${result.error.message}`);
        console.error(result.error);
      } else {
        addLog(`✅ CONNEXIÓ CORRECTA! Files a la taula: ${result.count}`);
      }

    } catch (err: unknown) { 
      // CANVI CLAU: Usem 'unknown' en lloc de 'any'
      let errorMessage = 'Error desconegut';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      addLog(`💥 EXCEPCIÓ: ${errorMessage}`);
      console.error(err);
    }
  };

  return (
    <div className="p-8 text-white bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-500">🚑 DIAGNÒSTIC D'URGÈNCIA</h1>
      
      {/* Estat Variables */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded border ${envStatus.url ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
          <div className="font-bold">SUPABASE_URL</div>
          <div className="text-2xl">{envStatus.url ? '✅ OK' : '❌ MISSING'}</div>
        </div>
        <div className={`p-4 rounded border ${envStatus.key ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
          <div className="font-bold">ANON_KEY</div>
          <div className="text-2xl">{envStatus.key ? '✅ OK' : '❌ MISSING'}</div>
        </div>
      </div>

      <button 
        onClick={testConnection}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg mb-6 transition-colors"
      >
        FORÇAR PROVA DE CONNEXIÓ
      </button>

      <div className="bg-black rounded-lg p-4 font-mono text-sm border border-slate-800 h-64 overflow-y-auto">
        {logs.length === 0 ? <span className="text-slate-500">Els logs apareixeran aquí...</span> : logs.map((log, i) => (
          <div key={i} className="mb-1 border-b border-slate-900 pb-1">{log}</div>
        ))}
      </div>
    </div>
  );
}