import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GreetingComponent } from "./greeting.component";
import { NgTemplate1RoutingModule } from "./ng-template1-routing.module";
import { MaterialModule } from "../shared/material.module";
import { GreetingTemplateComponent } from "./greeting-template.component";
import { GreetingTemplateDirective } from "./greeting-template.directive";

@NgModule({
  declarations: [
    GreetingComponent,
    GreetingTemplateDirective,
    GreetingTemplateComponent,
  ],
  imports: [CommonModule, NgTemplate1RoutingModule, MaterialModule],
})
export class NgTemplate1Module {}
