export interface LookupQueryParams {
  q?: string;
  search?: string;
}

export interface CampusLookupQueryParams extends LookupQueryParams {
  universityId?: string;
}
