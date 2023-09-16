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
import { Sort } from "@angular/material/sort";
import { BookDialogComponent } from "./ui/book-dialog.component";
// import { randBook, randCountry, randLanguage, randNumber } from "@ngneat/falso";

@Component({
  selector: "app-book",
  template: `
    <h1>Books</h1>
    <button
      mat-raised-button
      color="accent"
      style="margin:10px 0px;display: block;"
      (click)="onAddUpdate('Add')"
    >
      ➕
    </button>
    <ng-container *ngIf="store.vm$ | async as vm">
      <mat-spinner *ngIf="vm.loading" [diameter]="40" color="accent">
      </mat-spinner>
      <ng-container *ngIf="vm.error; else noerror">
        Oops! something went wrong
      </ng-container>
      <ng-template #noerror>
        <!-- filters -->
        <app-book-filters
          (search)="searchBook($event)"
          (selectedLanguages)="filterByLanguages($event)"
          [languages]="vm.languages"
        />
        <!-- book-list -->
        <ng-container *ngIf="vm.books; else nobooks">
          <app-book-list
            [books]="vm.books"
            (deleteBook)="onDelete($event)"
            (editBook)="onAddUpdate('Update', $event)"
            (sortData)="onSortData($event)"
          />
          <app-paginator
            [totalRecords]="vm.totalRecords"
            (pageSelect)="onPageSelect($event, vm.page, vm.pageLimit)"
          />
        </ng-container>
        <ng-template #nobooks> No books found </ng-template>
      </ng-template>
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

  searchBook(searchTerm: string | null) {
    this.store.setSearchTerm(searchTerm);
  }

  filterByLanguages(languages: string) {
    this.store.setLanguages(languages);
  }

  onAddUpdate(action: string, book: Book | null = null) {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: { book, title: action + " Book" },
    });

    dialogRef.componentInstance.sumbit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedBook) => {
        debugger;
        if (!submittedBook) return;
        if (submittedBook.id === 0) {
          this.store.addBook(submittedBook);
        } else {
          //update book
          if (book) this.store.updateBook(submittedBook);
        }
        // TODO: lines below only executed, when we have added books successfully
        dialogRef.componentInstance.bookForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  onDelete(book: Book) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { message: `💀Are you sure to delete '${book.title}'? ` },
    });

    dialogRef
      .beforeClosed()
      .pipe(
        tap((val) => {
          if (val) {
            this.store.removeBook(book.id);
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  onPageSelect(e: PageEvent, currentPage: number, currentPageLimit: number) {
    const page = e.pageIndex + 1;
    const pageLimit = e.pageSize;
    if (page !== currentPage) this.store.setPage(page);
    if (pageLimit !== currentPageLimit) this.store.setLimit(pageLimit);
  }

  onSortData(sort: Sort) {
    this.store.setSortColumn(sort.active);
    this.store.setSortDirection(sort.direction);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
