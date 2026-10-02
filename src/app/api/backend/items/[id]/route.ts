import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import {
  deleteMockItem,
  getMockItemById,
  updateMockItem,
} from '@/app/api/backend/mock-store';
import type { IItem } from '@/models';

const API_BASE_URL = process.env.API_BASE_URL;

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
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
    const item = getMockItemById(Number(id));
    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: item });
  }

  try {
    const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
    const origin = rawBase.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${origin}/items/${id}`, {
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

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 },
    );
  }

  let body: Partial<IItem>;
  try {
    body = (await request.json()) as Partial<IItem>;
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 },
    );
  }

  // Standalone Mock Mode
  if (!API_BASE_URL) {
    const updated = updateMockItem(Number(id), body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  }

  try {
    const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
    const origin = rawBase.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${origin}/items/${id}`, {
      method: 'PATCH',
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
      { success: false, error: { code: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Error' } },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
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
    const success = deleteMockItem(Number(id));
    if (!success) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: { success: true } });
  }

  try {
    const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
    const origin = rawBase.replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${origin}/items/${id}`, {
      method: 'DELETE',
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
