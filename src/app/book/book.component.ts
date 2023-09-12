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
import { PageEvent } from "@angular/material/paginator";

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
        <!-- filters -->
        <app-book-filters
          (search)="searchBook($event)"
          [languages]="['English', 'Hindi', 'Spanish', 'Italian']"
        />
        <!-- book-list -->
        <ng-container *ngIf="vm.books; else nobooks">
          <app-book-list
            [books]="vm.books"
            (deleteBook)="onDelete($event)"
            (editBook)="onEdit($event)"
          />
        </ng-container>
        <ng-template #nobooks> No books found </ng-template>
      </ng-template>
      <app-paginator
        [totalRecords]="vm.totalRecords"
        (pageSelect)="onPageSelect($event, vm.page, vm.pageLimit)"
      />
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

  searchBook(searchTerm: string) {
    this.store.setSearchTerm(searchTerm);
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

  onPageSelect(e: PageEvent, currentPage: number, currentPageLimit: number) {
    const page = e.pageIndex + 1;
    const pageLimit = e.pageSize;
    if (page !== currentPage) this.store.setPage(page);
    if (pageLimit !== currentPageLimit) this.store.setLimit(pageLimit);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
