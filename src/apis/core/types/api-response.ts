export type ApiFieldErrors = Record<string, string[]>;

export interface ApiErrorDetail {
  path?: (string | number)[];
  message?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[] | unknown;
  fields?: ApiFieldErrors;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  perPage: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
  total: number;
  totalPages: number;
  stats?: any;
}

export interface ApiPaginatedSuccessResponse<TItem> {
  success: true;
  data: TItem[];
  meta: PaginationMeta;
}

export type ApiPaginatedResponse<TItem> =
  ApiPaginatedSuccessResponse<TItem> | ApiErrorResponse;

export interface PaginatedResult<TItem> {
  items: TItem[];
  meta: PaginationMeta;
}
