import { Component } from "@angular/core";

@Component({
  selector: "app-header",
  template: `
    <p>
      <mat-toolbar color="primary">
        <span>Angular samples</span>
        <span class="example-spacer"></span>

        <button mat-button>Home</button>
        <button mat-button>Person</button>
        <!-- <button
          mat-icon-button
          class="example-icon favorite-icon"
          aria-label="Example icon-button with heart icon"
        >
          <mat-icon>favorite</mat-icon>
        </button>
        <button
          mat-icon-button
          class="example-icon"
          aria-label="Example icon-button with share icon"
        >
          <mat-icon>share</mat-icon>
        </button> -->
      </mat-toolbar>
    </p>
  `,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class HeaderComponent {}
