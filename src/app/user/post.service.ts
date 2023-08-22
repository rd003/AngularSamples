import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { PostModel } from "./post.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = "https://jsonplaceholder.typicode.com/users";
  getPosts(userId: number) {
    return this._http.get<PostModel[]>(`${this._baseUrl}/${userId}/posts`);
  }
  constructor() {}
}
