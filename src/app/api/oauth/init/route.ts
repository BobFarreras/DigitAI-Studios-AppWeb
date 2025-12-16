import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider'); // 'linkedin' o 'facebook'
  
  // URL on tornarem després que l'usuari accepti
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`;

  // ---------------------------------------------------------
  // 1. LINKEDIN
  // ---------------------------------------------------------
  if (provider === 'linkedin') {
    const scope = encodeURIComponent('openid profile email w_member_social'); // Permisos necessaris
    const state = 'linkedin_state_proteccio'; // Idealment un string random per seguretat

    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scope}`;
    
    return NextResponse.redirect(url);
  }

  // ---------------------------------------------------------
  // 2. FACEBOOK (Meta)
  // ---------------------------------------------------------
  if (provider === 'facebook') {
    // Permisos: 'pages_manage_posts' i 'pages_read_engagement' són claus per publicar com a pàgina
    const scope = encodeURIComponent('public_profile,email,pages_manage_posts,pages_read_engagement,pages_show_list');
    const state = 'facebook_state_proteccio';

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scope}`;

    return NextResponse.redirect(url);
  }

  return NextResponse.json({ error: 'Proveïdor no suportat' }, { status: 400 });
}