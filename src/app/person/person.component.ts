import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PersonFacade } from "./person-facade";
import { catchError, of } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { generateGUID } from "ngx-rlibs";
import { Person } from "./person.model";

@Component({
  selector: "app-person",
  template: `
    <h1>People</h1>
    <div class="people-container">
      <!-- people data  -->
      <div class="people-data">
        <ng-container *ngIf="people$ | async as people">
          <table mat-table class="mat-elevation-z8" [dataSource]="people">
            <ng-container matColumnDef="Id">
              <th mat-header-cell *matHeaderCellDef>Person Id</th>
              <td mat-cell *matCellDef="let element">{{ element.id }}</td>
            </ng-container>

            <ng-container matColumnDef="Name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let element">{{ element.name }}</td>
            </ng-container>

            <ng-container matColumnDef="Actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button
                  mat-icon-button
                  color="accent"
                  (click)="onEdit(element)"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="onDelete(element)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </ng-container>
      </div>

      <!-- people form -->
      <div class="people-form">
        <form [formGroup]="personForm" (ngSubmit)="onSubmit()">
          <p>
            <mat-form-field appearance="fill">
              <mat-label>Enter name</mat-label>
              <input matInput placeholder="Name" formControlName="name" />
              <mat-error
                *ngIf="
                  f['name'].invalid && (f['name'].touched || f['name'].dirty)
                "
                >Name is required</mat-error
              >
            </mat-form-field>
          </p>
          <p>
            <button
              mat-raised-button
              color="primary"
              [disabled]="personForm.invalid"
            >
              Add
            </button>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      table {
        width: 100%;
      }

      .people-container {
        width: 100%;
        display: flex;
      }

      .people-data {
        width: 55%;
      }

      .people-form {
        flex-grow: 1;
        margin: 0px 5%;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonComponent {
  private readonly personFacade = inject(PersonFacade);
  people$ = this.personFacade.people$.pipe(
    catchError((error) => {
      console.log(error);
      return of(error);
    })
  );

  displayedColumns: string[] = ["Id", "Name", "Actions"];

  personForm = new FormGroup({
    id: new FormControl(null),
    name: new FormControl("", Validators.required),
  });

  get f() {
    return this.personForm.controls;
  }
  onSubmit() {
    const person = Object.assign(this.personForm.value);
    person.id = generateGUID();
    this.personFacade.modifyPerson(person, "Add");
    this.personForm.reset();
  }

  onEdit(person: Person) {
    // this.personForm.patchValue();
  }

  onDelete(person: Person) {}
}
