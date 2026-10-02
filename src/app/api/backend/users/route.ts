import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import { getMockUsers } from '@/app/api/backend/mock-store';

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 },
    );
  }

  // Standalone Mock Mode
  if (!API_BASE_URL) {
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const perPage = Number(request.nextUrl.searchParams.get('perPage')) || 10;
    const result = getMockUsers({ page, perPage });

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  }

  try {
    const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
    const origin = rawBase.replace(/\/api\/v1\/?$/, '');
    const backendUrl = new URL(`${origin}/api/v1/auth/users`);
    request.nextUrl.searchParams.forEach((v, k) => backendUrl.searchParams.append(k, v));

    const res = await fetch(backendUrl, {
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
      { success: false, error: { code: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Error' } },
      { status: 500 },
    );
  }
}
