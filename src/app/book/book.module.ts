import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../shared/material.module";
import { BookRoutingModule } from "./book-routing.module";
import { BookComponent } from "./book.component";
import { BookListComponent } from "./ui/book-list.component";
import { BookFormComponent } from "./ui/book-form.component";
import { BookDetailComponent } from "./ui/book-detail.component";
import { PaginatorComponent } from "./ui/paginator.component";
import { BookFiltersComponent } from "./ui/book-filters.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    BookComponent,
    BookListComponent,
    BookFormComponent,
    BookDetailComponent,
    PaginatorComponent,
    BookFiltersComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BookRoutingModule,
    ReactiveFormsModule,
  ],
})
export class BookModule {}
