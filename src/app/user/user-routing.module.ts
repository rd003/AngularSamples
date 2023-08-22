import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserComponent } from "./user.component";
import { PostComponent } from "./post.component";
import { userPostResolver } from "./user-post.resolver";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
  },
  {
    path: ":id/posts",
    component: PostComponent,
    resolve: { posts: userPostResolver },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
