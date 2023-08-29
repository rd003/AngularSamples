import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { GreetingComponent } from "./greeting.component";
const routes: Route[] = [
  {
    path: "",
    component: GreetingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgTemplate1RoutingModule {}
