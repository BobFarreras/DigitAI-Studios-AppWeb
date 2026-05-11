import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/oauth/callback/route';
import { resolveSocialOauthCallback } from '@/actions/social-oauth-callback';

vi.mock('@/actions/social-oauth-callback', () => ({
  resolveSocialOauthCallback: vi.fn(),
}));

describe('API: OAuth Callback (Social Media)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(resolveSocialOauthCallback).mockResolvedValue(
      'http://localhost:3000/admin/blog?connected=true'
    );
  });

  it("hauria de redirigir amb error si no hi ha codi d'autoritzacio", async () => {
    const req = new NextRequest('http://localhost:3000/api/oauth/callback');
    const response = await GET(req);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toContain('error=auth_failed');
    expect(resolveSocialOauthCallback).not.toHaveBeenCalled();
  });

  it('hauria de bloquejar el callback si el state no coincideix', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/oauth/callback?code=abc&state=attacker-state',
      {
        headers: {
          cookie: 'oauth_state=server-state; oauth_provider=linkedin',
        },
      }
    );

    const response = await GET(req);

    expect(response.headers.get('location')).toContain('error=invalid_state');
    expect(resolveSocialOauthCallback).not.toHaveBeenCalled();
  });

  it('hauria de processar callback valid amb state i provider segurs', async () => {
    const req = new NextRequest('http://localhost:3000/api/oauth/callback?code=abc&state=ok-state', {
      headers: {
        cookie: 'oauth_state=ok-state; oauth_provider=linkedin',
      },
    });

    const response = await GET(req);

    expect(resolveSocialOauthCallback).toHaveBeenCalledWith(req.url, 'linkedin');
    expect(response.headers.get('location')).toContain('connected=true');
  });
});
