import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from "@angular/core";
import { BookStore } from "./book.store";
import { provideComponentStore } from "@ngrx/component-store";
import { Book } from "./book.model";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../shard/dialog.component";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: "app-book",
  template: `
    <h1>Books</h1>
    <ng-container *ngIf="store.vm$ | async as vm">
      <mat-spinner *ngIf="vm.loading" [diameter]="40" color="accent">
      </mat-spinner>
      <ng-container *ngIf="vm.error; else noerror"
        >Error on loading books</ng-container
      >
      <ng-template #noerror>
        <ng-container *ngIf="vm.books; else nobooks">
          <app-book-list
            [books]="vm.books"
            (deleteBook)="onDelete($event)"
            (editBook)="onEdit($event)"
          />
        </ng-container>
        <ng-template #nobooks> No books found </ng-template>
      </ng-template>
      page: {{ vm.page }}
      <button mat-raised-button (click)="nextPage(vm.page)">Next</button>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(BookStore)],
})
export class BookComponent implements OnDestroy {
  store = inject(BookStore);
  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();

  nextPage(currentPage: number) {
    this.store.setPage(currentPage + 1);
  }

  onDelete(book: Book) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { message: `💀Are you sure to delete '${book.title}'? ` },
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((val) => {
          if (val) {
            //this.personFacade.delete(person);
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  onEdit(book: Book) {
    console.log(book);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}