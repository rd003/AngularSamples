import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Person } from "./person.model";

@Injectable({
  providedIn: "root",
})
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + "/people";

  getPeople() {
    return this.http.get<Person[]>(this.baseUrl);
  }

  getPerson(id: string) {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  deletePerson(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  updatePerson(person: Person) {
    return this.http.patch<Person>(`${this.baseUrl}/${person.id}`, person);
  }

  createPerson(person: Person) {
    return this.http.post<Person>(this.baseUrl, person);
  }
}
