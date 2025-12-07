import { createClient } from '@/lib/supabase/server';

export type MissionStats = {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    pending: number;
    progress: number;
    xpReward: number;
};

// Tipus de retorn per a les estadístiques d'usuari
export type UserGamificationStats = {
    xp: number;
    level: number;
    completedTasks: number;
    nextLevelXp: number;
    progressToNext: number;
    rankName: string; // Només el text (ex: "Novell")
};

export class GamificationService {
    
    async getUserStats(userId: string): Promise<UserGamificationStats> {
        const supabase = await createClient();
        
        const { count } = await supabase
            .from('test_results')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'pass');

        const completedTasks = count || 0;
        const xp = completedTasks * 100;
        const level = Math.floor(xp / 1000) + 1;
        const nextLevelXp = level * 1000;
        
        // Evitem divisió per zero si estem al nivell 1 amb 0 XP
        const progressToNext = nextLevelXp > 0 
            ? ((xp % 1000) / 1000) * 100 
            : 0;

        return {
            xp,
            level,
            completedTasks,
            nextLevelXp,
            progressToNext,
            rankName: this.getRankName(level)
        };
    }

    calculateMissionStats(totalTasks: number, userResults: { status: string }[]): MissionStats {
        const passed = userResults.filter(r => r.status === 'pass').length;
        const failed = userResults.filter(r => r.status === 'fail').length;
        const blocked = userResults.filter(r => r.status === 'blocked').length;
        const pending = totalTasks - (passed + failed + blocked);
        
        const progress = totalTasks > 0 ? Math.round((passed / totalTasks) * 100) : 0;
        const xpReward = totalTasks * 100;

        return { total: totalTasks, passed, failed, blocked, pending, progress, xpReward };
    }

    // Retornem només la CLAU del rang, les icones les posarà el Frontend
    private getRankName(level: number): string {
        if (level < 2) return "Novell";
        if (level < 5) return "Bug Hunter";
        if (level < 10) return "Expert";
        return "Mestre";
    }
}