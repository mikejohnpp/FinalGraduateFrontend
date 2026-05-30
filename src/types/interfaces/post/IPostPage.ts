export interface CursorPageResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
