import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Ruta corregida

// Definim el tipus de dades que passarem a la funció de guardar
interface ConnectionData {
    provider: 'linkedin' | 'facebook';
    accessToken: string;
    providerAccountId: string;
    providerPageId: string;
    providerPageName: string;
    providerAvatar?: string;
    expiresIn?: number;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectOnSuccess = `${origin}/admin/blog?connected=true`;

    // 1. Gestió d'errors inicials
    if (error || !code) {
        return NextResponse.redirect(`${origin}/admin/blog?error=auth_failed`);
    }

    try {
        // ------------------------------------------------------------------
        // A) GESTIÓ DE LINKEDIN
        // ------------------------------------------------------------------
        if (state?.includes('linkedin')) {

            const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: `${origin}/api/oauth/callback`,
                    client_id: process.env.LINKEDIN_CLIENT_ID!,
                    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
                }),
            });

            const tokenData = await tokenRes.json();
            if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Error obtenint token LinkedIn');

            const accessToken = tokenData.access_token;

            // Obtenir dades de l'usuari
            const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!userRes.ok) throw new Error('Error obtenint perfil LinkedIn');
            const userData = await userRes.json();

            await saveConnection({
                provider: 'linkedin',
                accessToken,
                providerAccountId: userData.sub,
                providerPageId: userData.sub,
                providerPageName: userData.name || 'LinkedIn User',
                providerAvatar: userData.picture,
                expiresIn: tokenData.expires_in
            });
        }

        // ------------------------------------------------------------------
        // B) GESTIÓ DE FACEBOOK
        // ------------------------------------------------------------------
        else if (state?.includes('facebook')) {

            const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${origin}/api/oauth/callback&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`;
            const tokenRes = await fetch(tokenUrl);
            const tokenData = await tokenRes.json();

            if (tokenData.error) throw new Error(tokenData.error.message);
            const userAccessToken = tokenData.access_token;

            // Obtenir les PÀGINES
            const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`);
            const pagesData = await pagesRes.json();

            if (!pagesData.data || pagesData.data.length === 0) {
                return NextResponse.redirect(`${origin}/admin/blog?error=no_pages_found`);
            }

            // Guardem la primera pàgina trobada
            const page = pagesData.data[0];

            await saveConnection({
                provider: 'facebook',
                accessToken: page.access_token,
                providerAccountId: page.id,
                providerPageId: page.id,
                providerPageName: page.name,
                providerAvatar: `https://graph.facebook.com/${page.id}/picture`,
                expiresIn: tokenData.expires_in
            });
        }

        return NextResponse.redirect(redirectOnSuccess);

    } catch (err: unknown) { // ✅ Ús correcte: 'unknown' en lloc de 'any'
        console.error("OAuth Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown Auth Error';
        return NextResponse.redirect(`${origin}/admin/blog?error=${encodeURIComponent(errorMessage)}`);
    }

    // Helper intern amb millor debugging
    async function saveConnection(data: ConnectionData) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("❌ Error Auth: No hi ha usuari loguejat a la sessió.");
            throw new Error("No user found in session");
        }

        console.log("🔍 Buscant perfil per user_id:", user.id);

        // Intentem recuperar el perfil
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .maybeSingle(); // Usem maybeSingle per no llançar excepció si no n'hi ha

        // DIAGNÒSTIC D'ERRORS
        if (profileError) {
            console.error("❌ Error RLS o DB:", profileError);
            throw new Error(`Error DB accedint al perfil: ${profileError.message}`);
        }

        if (!profile) {
            console.error("❌ Dades no trobades: L'usuari existeix a Auth però no a la taula Profiles.");
            throw new Error(`Perfil incomplet. Falta el registre a la taula 'profiles' per l'ID ${user.id}`);
        }

        console.log("✅ Perfil trobat. Org ID:", profile.organization_id);

        // Fem l'UPSERT
        const { error } = await supabase.from('social_connections').upsert({
            organization_id: profile.organization_id,
            user_id: user.id,
            provider: data.provider,
            access_token: data.accessToken,
            provider_account_id: data.providerAccountId,
            provider_page_id: data.providerPageId,
            provider_page_name: data.providerPageName,
            provider_avatar_url: data.providerAvatar,
            expires_at: data.expiresIn ? Date.now() + (data.expiresIn * 1000) : null,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'organization_id, provider, provider_page_id'
        });

        if (error) {
            console.error("❌ Error guardant connexió:", error);
            throw error;
        }
    }
}