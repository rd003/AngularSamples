import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Book } from "../book.model";

@Component({
  selector: "app-book-list",
  template: `
    <table mat-table class="mat-elevation-z8" [dataSource]="books">
      <ng-container matColumnDef="Title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let book">{{ book.title }}</td>
      </ng-container>

      <ng-container matColumnDef="Author">
        <th mat-header-cell *matHeaderCellDef>Author</th>
        <td mat-cell *matCellDef="let book">{{ book.author }}</td>
      </ng-container>

      <ng-container matColumnDef="Language">
        <th mat-header-cell *matHeaderCellDef>Language</th>
        <td mat-cell *matCellDef="let book">{{ book.language }}</td>
      </ng-container>

      <ng-container matColumnDef="Price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let book">{{ book.price }}</td>
      </ng-container>

      <ng-container matColumnDef="Year">
        <th mat-header-cell *matHeaderCellDef>Year</th>
        <td mat-cell-def *matCellDef="let book">{{ book.year }}</td>
      </ng-container>

      <ng-container matColumnDef="Actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell-def *matCellDef="let book">
          <button mat-icon-button color="accent" (click)="editBook.emit(book)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteBook.emit(book)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  @Input({ required: true }) books!: Book[];
  @Output() deleteBook = new EventEmitter<Book>();
  @Output() editBook = new EventEmitter<Book>();
  displayedColumns: string[] = [
    "Title",
    "Author",
    "Language",
    "Year",
    "Price",
    "Actions",
  ];
}
