import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-footer",
  template: `
    Made by <a href="https://twitter.com/ravi_devrani">Ravindra Devrani</a>
  `,
  styles: [
    `
      a {
        color: black;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
