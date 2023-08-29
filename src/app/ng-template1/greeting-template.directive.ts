import { Directive } from "@angular/core";

@Directive({
  selector: "[greeting-template]",
})
export class GreetingTemplateDirective {
  constructor() {}
}
