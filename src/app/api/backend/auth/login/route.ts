import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import { SYSTEM_PERMISSIONS_LIST } from '@/utils/permissions';
import type { ApiResponse } from '@/apis/core/types/api-response';
import type { LoginRequestDto, LoginResponseDto } from '@/apis/services/auth/_dto';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

interface RawBackendLoginResult {
  token?: string;
  accessToken?: string;
  tokenType?: 'Bearer';
  user: {
    id: string | number;
    username: string;
    name: string;
    isActive?: boolean;
    isSuperAdmin?: boolean;
    roles?: string[];
    permissions?: string[];
    createdAt?: string | null;
    lastLoginAt?: string | null;
    profileImageUrl?: string | null;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: LoginRequestDto;
  try {
    body = (await request.json()) as LoginRequestDto;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid JSON body in request',
        },
      },
      { status: 400 },
    );
  }

  // Standalone / Mock Mode if API_BASE_URL is not set
  if (!API_BASE_URL) {
    const isUser = body.username === 'user';
    const mockUser = isUser
      ? {
          id: 'usr-demo-02',
          name: 'کاربر نمونه دمو',
          username: 'user',
          role: 'moderator' as const,
          roles: ['moderator'],
          isSuperAdmin: false,
          permissions: ['reviews:read', 'reviews:approve'],
          createdAt: '2026-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
        }
      : {
          id: 'c1f7b8e2-001',
          name: 'مدیر ارشد سیستم',
          username: body.username || 'admin',
          role: 'super_admin' as const,
          roles: ['super_admin'],
          isSuperAdmin: true,
          isActive: true,
          permissions: SYSTEM_PERMISSIONS_LIST.map((p) => p.code),
          createdAt: '2026-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
        };

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, 'mock-access-token-123', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    const safeResponse: ApiResponse<LoginResponseDto> = {
      success: true,
      data: {
        tokenType: 'Bearer',
        user: mockUser,
      },
    };

    return NextResponse.json(safeResponse);
  }

  // Live Backend Mode: proxy to real backend (try /api/v1/auth/login first, then /auth/login)
  try {
    const cleanBaseUrl = (API_BASE_URL || '').replace(/\/+$/, '');
    const apiV1Base = cleanBaseUrl.endsWith('/api/v1')
      ? cleanBaseUrl
      : `${cleanBaseUrl}/api/v1`;
    const loginUrl = `${apiV1Base}/auth/login`;

    const backendResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
      cache: 'no-store',
    });

    const payload =
      (await backendResponse.json()) as ApiResponse<RawBackendLoginResult>;

    if (!backendResponse.ok || !payload.success) {
      return NextResponse.json(payload, {
        status: backendResponse.status,
      });
    }

    const { token, accessToken, user } = payload.data;
    const resolvedToken = token || accessToken || '';

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, resolvedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    const safeResponse: ApiResponse<LoginResponseDto> = {
      success: true,
      data: {
        tokenType: 'Bearer',
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: (user.roles?.[0] || 'ADMIN') as string,
          roles: user.roles,
          isSuperAdmin: user.isSuperAdmin,
          permissions: user.permissions || [],
          profileImageUrl: user.profileImageUrl || null,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
      },
    };

    return NextResponse.json(safeResponse);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: err instanceof Error ? err.message : 'Server connection failed',
        },
      },
      { status: 500 },
    );
  }
}
