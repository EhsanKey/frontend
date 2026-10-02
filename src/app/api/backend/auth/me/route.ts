import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import { getMockCurrentUser } from '@/app/api/backend/mock-store';

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No active session found',
        },
      },
      { status: 401 },
    );
  }

  // Standalone Mock Mode
  if (!API_BASE_URL) {
    return NextResponse.json({
      success: true,
      data: getMockCurrentUser(),
    });
  }

  try {
    const cleanBaseUrl = (API_BASE_URL || '').replace(/\/+$/, '');
    const apiV1Base = cleanBaseUrl.endsWith('/api/v1')
      ? cleanBaseUrl
      : `${cleanBaseUrl}/api/v1`;
    const meUrl = `${apiV1Base}/auth/me`;
    const res = await fetch(meUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: err instanceof Error ? err.message : 'Error fetching user',
        },
      },
      { status: 500 },
    );
  }
}
