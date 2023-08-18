import { Injectable, inject } from "@angular/core";
import { PersonService } from "./person.service";
import { Person } from "./person.model";
import { Subject, scan, startWith, switchMap } from "rxjs";
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
    switchMap(
      (initialPeople) =>
        this.modifyPersonSubject.pipe(
          // emmiting starting values
          startWith({ person: {} as Person, action: "Remove" as actionType }),
          scan(
            (acc, curr) => {
              if (curr.action === "Add") {
                return [...acc, curr.person];
              } else if (curr.action === "Update") {
                return acc.map((a) =>
                  a.id === curr.person.id ? curr.person : a
                );
              } else if (curr.action === "Delete") {
                return acc.filter((a) => a.id != curr.person.id);
              }
              return acc;
            },
            [...initialPeople]
          )
        )
      // hold values
    )
  );

  modifyPerson(person: Person, action: actionType) {
    this.modifyPersonSubject.next({ person, action });
  }
}
