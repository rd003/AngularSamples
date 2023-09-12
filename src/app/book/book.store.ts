import { Injectable, inject } from "@angular/core";
import { Book, GetBookParams, PagedBook } from "./book.model";
import { HttpErrorResponse } from "@angular/common/http";
import { combineLatest, pipe, switchMap, tap, withLatestFrom } from "rxjs";
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from "@ngrx/component-store";
import { BookService } from "./book.service";

interface BookState {
  pagedBooks: PagedBook;
  loading: boolean;
  error: HttpErrorResponse | null;
  page: number;
  limit: number;
  searchTerm: string | null;
  selectedLanguages: string | null;
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
}

const _initialState: BookState = {
  pagedBooks: { books: [], paginationData: { totalPages: 0, totalRecords: 0 } },
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  searchTerm: null,
  selectedLanguages: null,
  sortColumn: null,
  sortDirection: null,
};

@Injectable()
export class BookStore
  extends ComponentStore<BookState>
  implements OnStoreInit, OnStateInit
{
  private readonly _bookService = inject(BookService);
  private readonly _books$ = this.select((s) => s.pagedBooks.books);
  private readonly _totalRecords$ = this.select(
    (s) => s.pagedBooks.paginationData.totalRecords
  );
  private readonly _loading$ = this.select((s) => s.loading);
  private readonly _error$ = this.select((s) => s.error);
  private readonly _page$ = this.select((s) => s.page);
  private readonly _limit$ = this.select((s) => s.limit);
  private readonly _searchTerm$ = this.select((s) => s.searchTerm);
  private readonly _selectedLanguages$ = this.select(
    (s) => s.selectedLanguages
  );
  private readonly _sortColumn$ = this.select((s) => s.sortColumn);
  private readonly _sortDirection$ = this.select((s) => s.sortDirection);

  vm$ = this.select(
    {
      books: this._books$,
      loading: this._loading$,
      error: this._error$,
      totalRecords: this._totalRecords$,
      page: this._page$,
      pageLimit: this._limit$,
    },
    { debounce: true }
  );

  #setLoading = this.updater((state) => ({ ...state, loading: true }));
  #setError = this.updater((state, error: HttpErrorResponse) => ({
    ...state,
    loading: false,
    error,
  }));

  #addAll = this.updater((state, pagedBooks: PagedBook) => ({
    ...state,
    loading: false,
    pagedBooks,
  }));

  setPage = this.updater((state, page: number) => ({ ...state, page }));
  setLimit = this.updater((state, limit: number) => ({ ...state, limit }));
  setSearchTerm = this.updater((state, searchTerm: string) => ({
    ...state,
    searchTerm,
  }));
  setLanguages = this.updater((state, selectedLanguages: string) => ({
    ...state,
    selectedLanguages,
  }));

  setSortColumn = this.updater((state, sortColumn: string) => ({
    ...state,
    sortColumn,
  }));

  setColumnDirection = this.updater((state, sortDirection: "asc" | "desc") => ({
    ...state,
    sortDirection,
  }));

  loadBooks = this.effect<GetBookParams>(
    pipe(
      tap(() => this.#setLoading()),
      switchMap(
        ({ page, limit, searchTerm, languages, sortColumn, sortDirection }) => {
          return this._bookService
            .getBooks({
              page,
              limit,
              searchTerm,
              languages,
              sortColumn,
              sortDirection,
            })
            .pipe(
              tapResponse(
                (pagedBook: PagedBook) => this.#addAll(pagedBook),
                (error: HttpErrorResponse) => this.#setError(error)
              )
            );
        }
      )
    )
  );

  ngrxOnStoreInit() {
    this.setState({ ..._initialState });
  }
  ngrxOnStateInit() {
    combineLatest([
      this._page$,
      this._limit$,
      this._searchTerm$,
      this._selectedLanguages$,
      this._sortColumn$,
      this._sortDirection$,
    ])
      .pipe(
        tap(
          ([page, limit, searchTerm, languages, sortColumn, sortDirection]) => {
            this.loadBooks({
              page,
              limit,
              searchTerm,
              languages,
              sortColumn,
              sortDirection,
            });
          }
        )
      )
      .subscribe();
  }
}
