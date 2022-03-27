interface Pagination {
  Page: number;
  PageNext?: number;
  PagePrev?: number;
  PageTotal: number;
  Results: number;
  ResultsPerPage: number;
  ResultsTotal: number;
}

export interface PageResult<T> {
  Pagination: Pagination;
  Results: T[];
}
