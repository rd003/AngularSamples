import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { UserModel } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _baserUrl = "https://jsonplaceholder.typicode.com/users";
  getUsers() {
    return this._http.get<UserModel[]>(this._baserUrl);
  }
}
