import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from "@angular/core";
import { PersonFacade } from "./person-facade";
import { Subject, catchError, of, takeUntil, tap } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Person } from "./person.model";
import { DialogComponent } from "../shard/dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-person",
  template: `
    <h1>People</h1>
    <div class="people-container">
      <!-- people data  -->
      <div class="people-data">
        <ng-container *ngIf="state$ | async as state">
          <ng-container *ngIf="state.loading"> Loading.... </ng-container>
          <ng-container *ngIf="state.error"> error </ng-container>

          <ng-container *ngIf="state.people">
            <table
              mat-table
              class="mat-elevation-z8"
              [dataSource]="state.people"
            >
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
        </ng-container>
      </div>

      <!-- people form -->
      <div class="people-form">
        <form [formGroup]="personForm" (ngSubmit)="onSubmit()">
          <input type="hidden" formControlName="id" />
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
export class PersonComponent implements OnDestroy {
  private readonly personFacade = inject(PersonFacade);
  private readonly dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
  state$ = this.personFacade.state$;

  displayedColumns: string[] = ["Id", "Name", "Actions"];

  personForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string>("", Validators.required),
  });

  get f() {
    return this.personForm.controls;
  }
  onSubmit() {
    const person = Object.assign(this.personForm.value);
    this.personFacade.setLoading();
    if (!person.id) {
      // person.id = generateGUID();
      this.personFacade.addPerson(person);
    } else {
      this.personFacade.update(person);
    }
    this.personForm.reset();
  }

  onEdit(person: Person) {
    this.personForm.patchValue(person);
  }

  onDelete(person: Person) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { message: `💀Are you sure to delete '${person.name}'? ` },
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((val) => {
          if (val) {
            this.personFacade.setLoading();
            this.personFacade.delete(person);
          }
        }),
        catchError((error) => {
          console.log(error);
          return of(error);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
