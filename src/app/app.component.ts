import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <div class="main">
      <app-header />
      <div class="content">
        <router-outlet />
      </div>
      <app-footer class="footer" />
    </div>
  `,
  styles: [
    `
      .main {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        padding: 20px 0px;
        font-size: 16px;
        margin-top: auto;
      }

      .footer a {
        color: black;
      }
    `,
  ],
})
export class AppComponent {
  title = "AngularSamples";
}
