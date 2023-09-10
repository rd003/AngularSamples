import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Book } from "./book.model";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private readonly url = environment.bookApiUrl + "/api/books";
  private _http = inject(HttpClient);

  getBooks(
    language: string | null = null,
    searchTerm: string | null = null,
    sortColumn: string | null = null,
    sortDirection: string | null = null,
    page = 1,
    limit = 10
  ) {
    const params = new HttpParams().set("page", page).set("limit", limit);
    if (language) params.set("language", language);
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (sortColumn) params.set("sortColumn", sortColumn);
    if (sortDirection) params.set("sortDirection", sortDirection);
    return this._http.get<Book[]>(this.url, { params });
  }
}
