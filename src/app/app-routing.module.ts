import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "person",
    loadChildren: () =>
      import("./person/person.module").then((a) => a.PersonModule),
  },

  {
    path: "users",
    loadChildren: () => import("./user/user.module").then((a) => a.UserModule),
  },
  {
    path: "greeting",
    loadChildren: () =>
      import("./ng-template1/ng-template1.module").then(
        (a) => a.NgTemplate1Module
      ),
  },
  {
    path: "reusable-tables",
    loadChildren: () =>
      import("./reusable-table/reusable-table.module").then(
        (m) => m.ReusableTableModule
      ),
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
