import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BookComponent } from "./book.component";
import { MaterialModule } from "../shared/material.module";
import { BookRoutingModule } from "./book-routing.module";

@NgModule({
  declarations: [BookComponent],
  imports: [CommonModule, MaterialModule, BookRoutingModule],
})
export class BookModule {}
