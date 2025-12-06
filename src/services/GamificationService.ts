import { createClient } from '@/lib/supabase/server';

export class GamificationService {
    
    // Calcula XP i Nivell basant-se en tasques completades
    async getUserStats(userId: string) {
        const supabase = await createClient();
        
        // Comptem resultats positius (PASS)
        const { count } = await supabase
            .from('test_results')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'pass');

        const xp = (count || 0) * 100; // 100 punts per tasca
        const level = Math.floor(xp / 1000) + 1; // Nivell puja cada 10 tasques
        const nextLevelXp = level * 1000;
        const progressToNext = ((xp % 1000) / 1000) * 100;

        return {
            xp,
            level,
            completedTasks: count || 0,
            nextLevelXp,
            progressToNext,
            rank: this.getRankName(level)
        };
    }

    private getRankName(level: number) {
        if (level < 2) return "Novell 🐣";
        if (level < 5) return "Bug Hunter 🐛";
        if (level < 10) return "Tester Expert 🕵️";
        return "QA Master 👑";
    }

    // Calcula el % d'una campanya específica
    async getCampaignProgress(campaignId: string, userId: string, totalTasks: number) {
        const supabase = await createClient();
        
        // Obtenim quants resultats té aquest usuari per a aquesta campanya
        // (Fem un join complex o una query directa si sabem els task_ids... 
        //  per simplificar, assumim que tenim els task_ids o fem query inversa)
        
        // Mètode optimitzat:
        const { data: userResults } = await supabase
            .from('test_results')
            .select('status')
            .eq('user_id', userId)
            // Això requereix saber els IDs de les tasques, ho farem al component millor
            // O fem una vista SQL. Per ara retornem 0 i ho calculem al front.
            // ... (implementarem això al component visual directament per no complicar SQL ara)
        
        return 0; 
    }
}