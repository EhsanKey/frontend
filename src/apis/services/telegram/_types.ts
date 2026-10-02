export interface GetTelegramUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface GetTelegramGroupsParams {
  page?: number;
  pageSize?: number;
  universityId?: string;
  campusId?: string;
  search?: string;
}

export interface GetTelegramConversationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
