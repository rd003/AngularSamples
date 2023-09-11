export interface Book {
  id: number;
  author: string;
  country: string;
  imageLink: string;
  language: string;
  link: string;
  pages: number;
  title: string;
  year: number;
  price: number;
}

export interface PaginationData {
  totalRecords: number;
  totalPages: number;
}

export interface PagedBook {
  books: Book[];
  paginationData: PaginationData;
}

export interface GetBookParams {
  page?: number;
  limit?: number;
  language?: string | null;
  searchTerm?: string | null;
  sortColumn?: string | null;
  sortDirection?: string | null;
}
