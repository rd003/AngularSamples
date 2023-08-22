import { Injectable, inject } from "@angular/core";
import { PersonService } from "./person.service";
import { Person } from "./person.model";
import {
  NEVER,
  Observable,
  Subject,
  catchError,
  map,
  of,
  scan,
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

  people$ = this.personService.getPeople().pipe(
    switchMap((initialPeople) =>
      this.modifyPersonSubject.pipe(
        // emmiting starting values
        startWith({ person: {} as Person, action: "None" as actionType }),
        scan((acc, curr) => {
          if (curr.action === "None") return acc;
          if (curr.action === "Add")
            return this.handleAddPerson(acc, curr.person);
          if (curr.action === "Delete")
            return this.handleDelete(acc, curr.person);
          if (curr.action === "Update")
            return this.handleUpdate(acc, curr.person);
          return acc;
        }, of([...initialPeople]))
      )
    )
  );

  handleAddPerson(acc: Observable<Person[]>, person: Person) {
    return this.personService.createPerson(person).pipe(
      catchError((error) => {
        console.log(error);
        return NEVER;
      }),
      switchMap((res: Person) => {
        // Update and return the accumulator with the new person
        const updatedPeople = acc.pipe(map((a) => [...a, res]));
        return updatedPeople; // Return the updated array as an observable
      })
    );
  }

  handleDelete(acc: Observable<Person[]>, person: Person) {
    return this.personService.deletePerson(person.id).pipe(
      catchError((error) => {
        console.log(error);
        return NEVER;
      }),
      switchMap((res: Person) => {
        // Update and return the accumulator with the new person
        const updatedPeople = acc.pipe(
          map((a) => a.filter((p) => p.id !== person.id))
        );
        return updatedPeople; // Return the updated array as an observable
      })
    );
  }

  handleUpdate(acc: Observable<Person[]>, person: Person) {
    return this.personService.deletePerson(person.id).pipe(
      catchError((error) => {
        console.log(error);
        return NEVER;
      }),
      switchMap((res: Person) => {
        // Update and return the accumulator with the new person
        const updatedPeople = acc.pipe(
          map((a) => a.map((p) => (p.id === person.id ? person : p)))
        );
        return updatedPeople; // Return the updated array as an observable
      })
    );
  }

  modifyPerson(person: Person, action: actionType) {
    this.modifyPersonSubject.next({ person, action });
  }
}
