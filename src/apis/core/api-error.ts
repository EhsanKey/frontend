import axios from 'axios';
import type {
  ApiErrorPayload,
  ApiFieldErrors,
} from '@/apis/core/types/api-response';

export type ApiErrorMessageKey =
  | 'errors.generic'
  | 'errors.network'
  | 'errors.unauthorized'
  | 'errors.forbidden'
  | 'errors.server'
  | 'errors.validation'
  | 'errors.invalidCredentials';

export type ApiRequestError = {
  code: string;
  messageKey: ApiErrorMessageKey;
};

const API_ERROR_MESSAGE_KEYS = {
  VALIDATION_ERROR: 'errors.validation',
  INVALID_CREDENTIALS: 'errors.invalidCredentials',
  FORBIDDEN: 'errors.forbidden',
} as const satisfies Record<string, ApiErrorMessageKey>;

interface ApiExceptionOptions {
  code: string;
  messageKey: ApiErrorMessageKey;
  status?: number;
  fields?: ApiFieldErrors;
  serverMessage?: string;
}

export class ApiException extends Error {
  readonly code: string;
  readonly messageKey: ApiErrorMessageKey;
  readonly status?: number;
  readonly fields?: ApiFieldErrors;
  readonly serverMessage?: string;

  constructor({
    code,
    messageKey,
    status,
    fields,
    serverMessage,
  }: ApiExceptionOptions) {
    super(code);

    this.name = 'ApiException';
    this.code = code;
    this.messageKey = messageKey;
    this.status = status;
    this.fields = fields;
    this.serverMessage = serverMessage;
  }
}

function getMessageKey(code?: string, status?: number): ApiErrorMessageKey {
  if (code && code in API_ERROR_MESSAGE_KEYS) {
    return API_ERROR_MESSAGE_KEYS[code as keyof typeof API_ERROR_MESSAGE_KEYS];
  }

  if (status === 401) {
    return 'errors.unauthorized';
  }

  if (status === 403) {
    return 'errors.forbidden';
  }

  if (status !== undefined && status >= 500) {
    return 'errors.server';
  }

  return 'errors.generic';
}

export function createApiExceptionFromPayload(
  payload?: Partial<ApiErrorPayload> | null,
  status?: number,
): ApiException {
  const code = payload?.code || `HTTP_${status ?? 'UNKNOWN'}`;
  const serverMessage = payload?.message;
  return new ApiException({
    code,
    status,
    fields: payload?.fields,
    serverMessage,
    messageKey: getMessageKey(code, status),
  });
}

export function normalizeApiError(error: unknown): ApiException {
  if (error instanceof ApiException) {
    return error;
  }

  if (axios.isAxiosError<unknown>(error)) {
    const status = error.response?.status;

    if (!error.response) {
      return new ApiException({
        code: 'NETWORK_ERROR',
        messageKey: 'errors.network',
      });
    }

    const responseData = error.response.data as Record<string, unknown> | undefined;

    if (responseData && typeof responseData === 'object') {
      if (responseData.success === false && responseData.error) {
        return createApiExceptionFromPayload(
          responseData.error as ApiErrorPayload,
          status,
        );
      }

      if (responseData.message || responseData.error || responseData.code) {
        const errCode =
          typeof responseData.code === 'string'
            ? responseData.code
            : typeof responseData.error === 'string'
              ? responseData.error
              : `HTTP_${status ?? 'UNKNOWN'}`;
        const errMsg =
          typeof responseData.message === 'string'
            ? responseData.message
            : undefined;

        return createApiExceptionFromPayload(
          { code: errCode, message: errMsg },
          status,
        );
      }
    }

    return new ApiException({
      code: `HTTP_${status ?? 'UNKNOWN'}`,
      status,
      messageKey: getMessageKey(undefined, status),
    });
  }

  return new ApiException({
    code: 'UNKNOWN_ERROR',
    messageKey: 'errors.generic',
  });
}

export function toApiRequestError(error: unknown): ApiRequestError {
  const apiError = normalizeApiError(error);

  return {
    code: apiError.code,
    messageKey: apiError.messageKey,
  };
}
