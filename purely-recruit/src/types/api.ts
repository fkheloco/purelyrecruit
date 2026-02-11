export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T = any> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SearchParams = {
  q?: string;
  type?: "candidates" | "jobs";
  page?: string;
  pageSize?: string;
  sort?: string;
  order?: "asc" | "desc";
  status?: string;
  tenantId?: string;
};
