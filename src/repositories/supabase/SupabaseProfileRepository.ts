/**
 * @file src/repositories/supabase/SupabaseProfileRepository.ts
 * @updated 2026-05-20
 * @summary Supabase implementation for profile data access.
 * @scope Data access only; no business logic.
 */
import { createAdminClient, createClient } from '@/lib/supabase/server';

export class SupabaseProfileRepository {

    async findByEmailAndOrg(email: string, orgId: string) {
        const supabase = createAdminClient();
        const { data } = await supabase
            .from('profiles')
            .select('id')
            .ilike('email', email)
            .eq('organization_id', orgId)
            .maybeSingle();
        return data;
    }

    async findById(userId: string) {
        const supabase = createAdminClient();
        const { data } = await supabase
            .from('profiles')
            .select('id, organization_id')
            .eq('id', userId)
            .maybeSingle();
        return data;
    }

    async findRoleByUserId(userId: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId);
        return data;
    }

    async updateLocale(userId: string, locale: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from('profiles')
            .update({ locale } as Record<string, unknown>)
            .eq('id', userId)
            .select()
            .single();
        return data;
    }

    async createProfile(userId: string, email: string, orgId: string, fullName?: string) {
        const supabase = createAdminClient();
        return await supabase.from('profiles').insert({
            id: userId,
            email: email,
            organization_id: orgId,
            full_name: fullName
        });
    }
}