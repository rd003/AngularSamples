import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PersonComponent } from "./person.component";

const personRoutes: Routes = [
  {
    path: "",
    component: PersonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(personRoutes)],
  exports: [RouterModule],
})
export class PersonRoutingModule {}
