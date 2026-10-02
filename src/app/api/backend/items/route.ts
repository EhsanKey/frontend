import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import {
  createMockItem,
  getMockItems,
} from '@/app/api/backend/mock-store';
import type { IItem } from '@/models';

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
      },
      { status: 401 },
    );
  }

  // Standalone Mock Mode
  if (!API_BASE_URL) {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const perPage = Number(searchParams.get('perPage')) || 10;
    const search = searchParams.get('search') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const category = searchParams.get('category') ?? undefined;

    const result = getMockItems({ page, perPage, search, status, category });

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  }

  try {
    const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
    const origin = rawBase.replace(/\/api\/v1\/?$/, '');
    const backendUrl = new URL(`${origin}/items`);
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
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Error' },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 },
    );
  }

  let body: Omit<IItem, 'id' | 'createdAt'>;
  try {
    body = (await request.json()) as Omit<IItem, 'id' | 'createdAt'>;
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 },
    );
  }

  // Standalone Mock Mode
  if (!API_BASE_URL) {
    const newItem = createMockItem({
      ...body,
      authorName: 'مدیر سامانه',
    });

    return NextResponse.json({
      success: true,
      data: newItem,
    });
  }

  try {
    const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
    const origin = rawBase.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${origin}/items`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Error' },
      },
      { status: 500 },
    );
  }
}
