import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { GreetingTemplateDirective } from "./greeting-template.directive";

@Component({
  selector: "app-greeting-template",
  template: `
    <ng-content select=".heading"></ng-content>
    <ng-content select=".smiley"></ng-content>
    <ng-container
      [ngTemplateOutlet]="greetingTemplate"
      [ngTemplateOutletContext]="{
        $implicit: data
      }"
    >
    </ng-container>
  `,
  styles: [
    `
      :host {
        margin-top: 10px;
        display: block;
      }
    `,
  ],
})
export class GreetingTemplateComponent {
  @Input() data!: any;
  @ContentChild(GreetingTemplateDirective, { read: TemplateRef })
  greetingTemplate!: TemplateRef<any>;
}
