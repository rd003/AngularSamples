import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../shared/material.module";
import { BookRoutingModule } from "./book-routing.module";
import { BookComponent } from "./book.component";
import { BookListComponent } from './ui/book-list.component';
import { BookFormComponent } from './ui/book-form.component';
import { BookDetailComponent } from './ui/book-detail.component';

@NgModule({
  declarations: [BookComponent, BookListComponent, BookFormComponent, BookDetailComponent],
  imports: [CommonModule, MaterialModule, BookRoutingModule],
})
export class BookModule {}
