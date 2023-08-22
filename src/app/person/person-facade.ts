import { Injectable, inject } from "@angular/core";
import { PersonService } from "./person.service";
import { Person } from "./person.model";
import { BehaviorSubject, map } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

interface PersonState {
  people: Person[];
  loading: boolean;
  error: HttpErrorResponse | null;
}

const initalState: PersonState = {
  people: [],
  loading: true,
  error: null,
};

@Injectable({
  providedIn: "root",
})
export class PersonFacade {
  private readonly stateSubject = new BehaviorSubject<PersonState>(initalState);
  private readonly personService = inject(PersonService);
  state$ = this.stateSubject.asObservable();
  people$ = this.state$.pipe(map((s) => s.people));
  error$ = this.state$.pipe(map((s) => s.error));
  loading$ = this.state$.pipe(map((s) => s.loading));

  setLoading = () =>
    this.stateSubject.next({ ...this.stateSubject.value, loading: true });

  addPerson(person: Person) {
    this.personService.createPerson(person).subscribe({
      next: (person) =>
        this.stateSubject.next({
          ...this.stateSubject.value,
          people: [...this.stateSubject.value.people, person],
          loading: false,
        }),
      error: (error) => {
        this.stateSubject.next({
          ...this.stateSubject.value,
          loading: false,
          error,
        });
      },
    });
  }

  update(person: Person) {
    this.personService.updatePerson(person).subscribe({
      next: (person) =>
        this.stateSubject.next({
          ...this.stateSubject.value,
          people: [
            ...this.stateSubject.value.people.map((d) =>
              d.id === person.id ? person : d
            ),
          ],
          loading: false,
        }),
      error: (error) => {
        this.stateSubject.next({
          ...this.stateSubject.value,
          loading: false,
          error,
        });
      },
    });
  }

  delete(person: Person) {
    this.personService.deletePerson(person.id).subscribe({
      next: () =>
        this.stateSubject.next({
          ...this.stateSubject.value,
          people: [
            ...this.stateSubject.value.people.filter((d) => d.id !== person.id),
          ],
          loading: false,
        }),
      error: (error) => {
        this.stateSubject.next({
          ...this.stateSubject.value,
          loading: false,
          error,
        });
      },
    });
  }

  constructor() {
    this.personService.getPeople().subscribe({
      next: (people) =>
        this.stateSubject.next({
          ...this.stateSubject.value,
          people,
          loading: false,
        }),
      error: (error) => {
        this.stateSubject.next({
          ...this.stateSubject.value,
          loading: false,
          error,
        });
      },
    });
  }
}
