import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonComponent } from "./person.component";
import { PersonRoutingModule } from "./person-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [PersonComponent],
  imports: [
    CommonModule,
    PersonRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class PersonModule {}
