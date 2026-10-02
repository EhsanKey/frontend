import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants';
import { handleMockApi } from '@/app/api/backend/mock-store';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;

  // Standalone Mock Mode
  if (!API_BASE_URL) {
    const searchParamsObj: Record<string, unknown> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      searchParamsObj[key] = value;
    });

    let bodyData: unknown = undefined;
    if (!['GET', 'HEAD'].includes(request.method)) {
      try {
        bodyData = await request.json();
      } catch {
        bodyData = undefined;
      }
    }

    const cleanPathSegments = [...path];
    if (cleanPathSegments[0] === 'api' && cleanPathSegments[1] === 'backend') {
      cleanPathSegments.splice(0, 2);
    }

    const mockResult = await handleMockApi(
      request.method,
      cleanPathSegments.join('/'),
      searchParamsObj,
      bodyData,
    );

    const status = mockResult.success
      ? 200
      : (mockResult.error as { code?: string })?.code === 'NOT_FOUND'
        ? 404
        : 400;

    return NextResponse.json(mockResult, { status });
  }

  // Live Backend Mode
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const rawBase = (API_BASE_URL || '').replace(/\/+$/, '');
  const apiV1Base = rawBase.endsWith('/api/v1') ? rawBase : `${rawBase}/api/v1`;
  const origin = rawBase.replace(/\/api\/v1\/?$/, '');

  const cleanPathSegments = [...path];
  if (cleanPathSegments[0] === 'api' && cleanPathSegments[1] === 'backend') {
    cleanPathSegments.splice(0, 2);
  }
  let pathStr = cleanPathSegments.join('/');
  if (pathStr.startsWith('api/v1/')) {
    pathStr = pathStr.slice(7);
  }

  // Route to /api/v1/* (or legacy root origin for admin-data/*)
  const targetBase = pathStr.startsWith('admin-data/') ? origin : apiV1Base;
  const backendUrl = new URL(`${targetBase}/${pathStr}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  headers.set('Accept', request.headers.get('accept') ?? 'application/json');
  const contentType = request.headers.get('content-type');

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    if (backendResponse.status === 401) {
      cookieStore.delete(AUTH_COOKIE_NAME);
    }

    const responseBody = await backendResponse.arrayBuffer();
    const responseHeaders = new Headers();
    const responseContentType = backendResponse.headers.get('content-type');

    if (responseContentType) {
      responseHeaders.set('Content-Type', responseContentType);
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch {
    // Fallback to internal mock store if backend server is unreachable
    const searchParamsObj: Record<string, unknown> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      searchParamsObj[key] = value;
    });

    let bodyData: unknown = undefined;
    if (hasBody && body) {
      try {
        const text = new TextDecoder().decode(body);
        bodyData = JSON.parse(text);
      } catch {
        bodyData = undefined;
      }
    }

    const mockResult = await handleMockApi(
      request.method,
      pathStr,
      searchParamsObj,
      bodyData,
    );

    const status = mockResult.success
      ? 200
      : (mockResult.error as { code?: string })?.code === 'NOT_FOUND'
        ? 404
        : 400;

    return NextResponse.json(mockResult, { status });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
