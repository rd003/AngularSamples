import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { PostComponent } from "./post.component";
import { UserRoutingModule } from "./user-routing.module";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [UserComponent, PostComponent],
  imports: [CommonModule, UserRoutingModule, MaterialModule],
})
export class UserModule {}
