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
        scan(
          (acc, curr) => {
            if (curr.action === "None") return acc;
            if (curr.action === "Add") return [...acc, curr.person];
            if (curr.action === "Delete")
              return acc.filter((p) => p.id !== curr.person.id);
            if (curr.action === "Update")
              return acc.map((p) =>
                p.id === curr.person.id ? curr.person : p
              );
            return acc;
          },
          [...initialPeople]
        )
      )
    )
  );

  modifyPerson(person: Person, action: actionType) {
    this.modifyPersonSubject.next({ person, action });
  }
}
