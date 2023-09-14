import { Injectable, inject } from "@angular/core";
import { Book, GetBookParams, PagedBook, PaginationData } from "./book.model";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Observable,
  combineLatest,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs";
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
  sortDirection: string | null;
  languages: string[];
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
  languages: [],
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
  private readonly _languages$ = this.select((s) => s.languages);

  vm$ = this.select(
    {
      books: this._books$,
      loading: this._loading$,
      error: this._error$,
      totalRecords: this._totalRecords$,
      page: this._page$,
      pageLimit: this._limit$,
      languages: this._languages$,
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

  #addLanguages = this.updater((state, languages: string[]) => ({
    ...state,
    loading: false,
    languages,
  }));

  #addOne = this.updater((state, book: Book) => {
    const updatedPagedBooks: PagedBook = {
      ...state.pagedBooks,
      books: [...state.pagedBooks.books, book],
      paginationData: {
        ...state.pagedBooks.paginationData,
        totalRecords: state.pagedBooks.paginationData.totalRecords + 1,
        totalPages: Math.ceil(
          (state.pagedBooks.paginationData.totalRecords + 1) / state.limit
        ),
      },
    };
    return { ...state, loading: false, pagedBooks: updatedPagedBooks };
  });

  #updateBook = this.updater((state, book: Book) => ({
    ...state,
    loading: false,
    pagedBooks: {
      ...state.pagedBooks,
      books: state.pagedBooks.books.map((b) => (b.id === book.id ? book : b)),
    },
  }));

  #removeOne = this.updater((state, id: number) => {
    const updatedPagedBooks: PagedBook = {
      ...state.pagedBooks,
      books: state.pagedBooks.books.filter((a) => a.id !== id),
      paginationData: {
        ...state.pagedBooks.paginationData,
        totalRecords: state.pagedBooks.paginationData.totalRecords - 1,
        totalPages: Math.ceil(
          (state.pagedBooks.paginationData.totalRecords - 1) / state.limit
        ),
      },
    };
    return { ...state, loading: false, pagedBooks: updatedPagedBooks };
  });

  setPage = this.updater((state, page: number) => ({ ...state, page }));
  setLimit = this.updater((state, limit: number) => ({ ...state, limit }));
  setSearchTerm = this.updater((state, searchTerm: string | null) => ({
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

  setSortDirection = this.updater((state, sortDirection: string) => ({
    ...state,
    sortDirection,
  }));

  private readonly loadBooks = this.effect<GetBookParams>(
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

  private readonly loadLanguages = this.effect<void>(
    pipe(
      tap(() => this.#setLoading()),
      switchMap(() =>
        this._bookService.getLanguages().pipe(
          tapResponse(
            (languages) => this.#addLanguages(languages),
            (error: HttpErrorResponse) => this.#setError(error)
          )
        )
      )
    )
  );

  readonly addBook = this.effect<Book>((book$: Observable<Book>) =>
    book$.pipe(
      tap(() => this.#setLoading()),
      switchMap((book) =>
        this._bookService.addBook(book).pipe(
          tapResponse(
            (createdBook: Book) => {
              this.#addOne(createdBook);
              this.loadLanguages();
            },
            (error: HttpErrorResponse) => this.#setError(error)
          )
        )
      )
    )
  );

  readonly updateBook = this.effect<Book>((book$: Observable<Book>) =>
    book$.pipe(
      tap(() => this.#setLoading()),
      switchMap((book) =>
        this._bookService.updateBook(book).pipe(
          tapResponse(
            () => this.#updateBook(book),
            (error: HttpErrorResponse) => this.#setError(error)
          )
        )
      )
    )
  );

  readonly removeBook = this.effect<number>((id$: Observable<number>) =>
    id$.pipe(
      tap(() => this.#setLoading),
      switchMap((id) =>
        this._bookService.deleteBook(id).pipe(
          tapResponse(
            () => this.#removeOne(id),
            (error: HttpErrorResponse) => this.#setError(error)
          )
        )
      )
    )
  );

  ngrxOnStoreInit() {
    this.setState({ ..._initialState });
  }
  ngrxOnStateInit() {
    this.loadLanguages();
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
