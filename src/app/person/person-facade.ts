import { Injectable, inject } from "@angular/core";
import { PersonService } from "./person.service";
import { Person } from "./person.model";
import {
  Observable,
  Subject,
  catchError,
  map,
  tap,
  startWith,
  switchMap,
} from "rxjs";
import { actionType } from "../shared/shared-types";

@Injectable({
  providedIn: "root",
})
export class PersonFacade {
  // Injecting Person http service
  private readonly personService = inject(PersonService);

  private readonly modifyPersonSubject = new Subject<{
    person: Person;
    action: actionType;
  }>();

  people$ = this.modifyPersonSubject.pipe(
    switchMap(({ person, action }) => {
      if (action === "Add") {
        return this.handleAddPerson(person);
      } else if (action === "Delete") {
        return this.handleDelete(person);
      } else if (action === "Update") {
        return this.handleUpdate(person);
      } else {
        // No action, return initial people list
        return this.personService.getPeople();
      }
    }),
    startWith([] as Person[])
  );

  constructor() {
    this.people$.subscribe();
  }

  handleAddPerson(person: Person) {
    return this.personService.createPerson(person).pipe(
      catchError((error) => {
        console.log(error);
        return [];
      }),
      switchMap((res: Person) => {
        return this.personService.getPeople();
      })
    );
  }

  handleDelete(person: Person) {
    return this.personService.deletePerson(person.id).pipe(
      catchError((error) => {
        console.log(error);
        return [];
      }),
      switchMap((res: Person) => {
        return this.personService.getPeople();
      })
    );
  }

  handleUpdate(person: Person) {
    return this.personService.updatePerson(person).pipe(
      catchError((error) => {
        console.log(error);
        return [];
      }),
      switchMap((res: Person) => {
        return this.personService.getPeople();
      })
    );
  }

  modifyPerson(person: Person, action: actionType) {
    this.modifyPersonSubject.next({ person, action });
  }
}
