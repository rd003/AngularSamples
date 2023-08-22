import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Person } from "./person.model";
import { delay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + "/people";

  getPeople() {
    return this.http.get<Person[]>(this.baseUrl).pipe(delay(400));
  }

  getPerson(id: string) {
    return this.http.get<Person>(`${this.baseUrl}/${id}`).pipe(delay(400));
  }

  deletePerson(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(delay(400));
  }

  updatePerson(person: Person) {
    return this.http
      .patch<Person>(`${this.baseUrl}/${person.id}`, person)
      .pipe(delay(400));
  }

  createPerson(person: Person) {
    return this.http.post<Person>(this.baseUrl, person).pipe(delay(400));
  }
}
