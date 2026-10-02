export interface GetInquiriesFilterParams {
  search?: string;
  q?: string;
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
  perPage?: number;
  onlyEligible?: boolean;
}

export interface GetInquiryTopicsFilterParams {
  search?: string;
  type?: 'professor' | 'course';
  status?: 'active' | 'resolved' | 'archived';
  page?: number;
  pageSize?: number;
}
