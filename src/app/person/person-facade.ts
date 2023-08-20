import { Injectable, inject } from "@angular/core";
import { PersonService } from "./person.service";
import { Person } from "./person.model";
import {
  Observable,
  Subject,
  catchError,
  concatMap,
  map,
  of,
  scan,
  startWith,
  switchMap,
  tap,
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

  people$: Observable<Person[]> = this.personService.getPeople().pipe(
    switchMap((initialPeople) =>
      this.modifyPersonSubject.pipe(
        // emmiting starting values
        startWith({ person: {} as Person, action: "None" as actionType }),
        scan((acc, curr) => {
          return acc.pipe(
            switchMap((a) =>
              this.#modifyPersonData(a, curr.person, curr.action)
            )
          );
        }, of([...initialPeople]))
      )
    ),
    // just flattening the source
    concatMap((d) => d)
  );

  #modifyPersonData(
    people: Person[],
    person: Person,
    action: actionType
  ): Observable<Person[]> {
    if (action === "Add") {
      return this.personService.createPerson(person).pipe(
        catchError((error) => {
          console.log(error);
          return of(error);
        }),
        map((d) => [...people, d])
      );
    } else if (action === "Update") {
      return this.personService.updatePerson(person).pipe(
        catchError((error) => {
          console.log(error);
          return of(error);
        }),
        map((d) => people.map((p) => (p.id === d.id ? d : p)))
      );
    } else if (action === "Delete") {
      return this.personService.deletePerson(person.id).pipe(
        catchError((error) => {
          console.log(error);
          return of(error);
        }),
        map((_) => people.filter((a) => a.id !== person.id))
      );
    } else {
      return of(people);
    }
  }

  // #modifyPersonData(
  //   people: Person[],
  //   person: Person,
  //   action: actionType
  // ): Observable<Person[]> {
  //   debugger;
  //   if (action === "Add") {
  //     return of([...people, person]);
  //   } else if (action === "Update") {
  //     return of(people.map((p) => (p.id === person.id ? person : p)));
  //   } else if (action === "Delete") {
  //     return of(people.filter((a) => a.id !== person.id));
  //   } else {
  //     return of(people);
  //   }
  // }

  // without http

  // people$: Observable<Person[]> = this.personService.getPeople().pipe(
  //   switchMap((initialPeople) =>
  //     this.modifyPersonSubject.pipe(
  //       // emmiting starting values
  //       startWith({ person: {} as Person, action: "None" as actionType }),
  //       scan(
  //         (acc, curr) => {
  //           return this.#modifyPersonData(acc, curr.person, curr.action);
  //         },
  //         [...initialPeople]
  //       )
  //     )
  //   )
  // );

  // #modifyPersonData(
  //   people: Person[],
  //   person: Person,
  //   action: actionType
  // ): Person[] {
  //   debugger;
  //   if (action === "Add") {
  //     return [...people, person];
  //   } else if (action === "Update") {
  //     return people.map((p) => (p.id === person.id ? person : p));
  //   } else if (action === "Delete") {
  //     return people.filter((a) => a.id !== person.id);
  //   } else {
  //     return people;
  //   }
  // }

  modifyPerson(person: Person, action: actionType) {
    this.modifyPersonSubject.next({ person, action });
  }
}
