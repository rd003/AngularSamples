import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Book, GetBookParams, PagedBook } from "./book.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private readonly url = environment.bookApiUrl + "/api/books";
  private _http = inject(HttpClient);

  getBooks({
    page = 1,
    limit = 10,
    language = null,
    searchTerm = null,
    sortColumn = null,
    sortDirection = null,
  }: GetBookParams): Observable<PagedBook> {
    const params = new HttpParams().set("page", page).set("limit", limit);
    if (language) params.set("language", language);
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (sortColumn) params.set("sortColumn", sortColumn);
    if (sortDirection) params.set("sortDirection", sortDirection);
    return this._http.get<PagedBook>(this.url, { params });
  }

  getLanguages(): Observable<string> {
    return this._http.get<string>(this.url + "/languages");
  }

  getBook(id: number): Observable<Book> {
    return this._http.get<Book>(`${this.url}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this._http.post<Book>(this.url, book);
  }

  updateBook(book: Book): Observable<any> {
    return this._http.put<any>(this.url, book);
  }

  deleteBook(id: number): Observable<any> {
    return this._http.delete<any>(`${this.url}/${id}`);
  }
}
