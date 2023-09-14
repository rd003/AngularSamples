import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Book } from "../book.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-book-dialog",
  template: `
    <h1 mat-dialog-title>
      {{ data.title }}
    </h1>
    <div mat-dialog-content>
      <form [formGroup]="bookForm" class="book-form">
        <input formControlName="id" type="hidden" />
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput placeholder="title" formControlName="title" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Author</mat-label>
          <input matInput placeholder="author" formControlName="author" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Language</mat-label>
          <input matInput placeholder="language" formControlName="language" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Price</mat-label>
          <input matInput placeholder="price" formControlName="price" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Pages</mat-label>
          <input matInput placeholder="pages" formControlName="pages" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Year</mat-label>
          <input matInput placeholder="year" formControlName="year" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Country</mat-label>
          <input matInput placeholder="country" formControlName="country" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>link</mat-label>
          <input matInput placeholder="link" formControlName="link" />
        </mat-form-field>

        <!-- <mat-form-field appearance="fill">
          <mat-label>Language</mat-label>
          <input matInput placeholder="language" formControlName="" />
        </mat-form-field> -->
      </form>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="bookForm.invalid"
        cdkFocusInitial
      >
        Save
      </button>
      <button mat-raised-button color="warn" (click)="onCanceled()">
        Close
      </button>
    </div>
  `,
  styles: [
    `
      .book-form {
        display: grid;
        grid-template-columns: repeat(
          3,
          1fr
        ); /* Three columns with equal width */
        gap: 16px; /* Adjust the gap between columns as needed */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent {
  @Output() sumbit = new EventEmitter<Book>();
  //msg = this.data.message;
  bookForm = new FormGroup({
    id: new FormControl<number>(0),
    title: new FormControl<string>("", Validators.required),
    author: new FormControl<string>("", Validators.required),
    country: new FormControl<string>("", Validators.required),
    imageLink: new FormControl<string>(""),
    language: new FormControl<string>("", Validators.required),
    link: new FormControl<string>(""),
    pages: new FormControl<number>(0, Validators.required),
    year: new FormControl<number>(0, Validators.required),
    price: new FormControl<number>(0, Validators.required),
  });

  onCanceled() {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.bookForm.valid) {
      const book: Book = Object.assign(this.bookForm.value);
      this.sumbit.emit(book);
    }
  }
  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book | null; title: string }
  ) {
    if (data.book != null) {
      this.bookForm.patchValue(data.book);
    }
  }
}
