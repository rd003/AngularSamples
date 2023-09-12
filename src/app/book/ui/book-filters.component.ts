import { Component, Output, Input, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-book-filters",
  template: `
    <mat-form-field class="searchTerm" appearance="fill">
      <mat-label>Search</mat-label>
      <input
        [formControl]="searchTerm"
        matInput
        placeholder="type title/author"
      />
    </mat-form-field>

    <mat-form-field>
      <mat-label>Language</mat-label>
      <mat-select [formControl]="language" multiple>
        <mat-option *ngFor="let language of languages" [value]="languages">{{
          language
        }}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 10px;
      }

      .searchTerm {
        width: 300px;
      }
    `,
  ],
})
export class BookFiltersComponent {
  @Input({ required: true }) languages!: string[];
  @Output() search = new EventEmitter<string>();
  language = new FormControl<string[]>([]);
  searchTerm = new FormControl<string>("");
  constructor() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(300),
        tap((val) => {
          if (val) this.search.emit(val);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.language.valueChanges.pipe(
      tap((val) => {
        console.log(val);
      }),
      takeUntilDestroyed()
    );
  }
}
