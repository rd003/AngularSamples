import { Component } from "@angular/core";

@Component({
  selector: "app-greeting",
  template: `
    <app-greeting-template [data]="{ message: 'hello', name: 'John' }">
      <h1 class="heading">Lol.... 🙆</h1>
      <ng-template greeting-template let-data let-name>
        {{ data.message }} {{ data.name }}
      </ng-template>
    </app-greeting-template>
    <br />
    <app-greeting-template [data]="{ message: 'hola!', name: 'michael' }">
      <h1 class="heading">Greetings 🙆</h1>
      <div class="smiley" style="padding:6px 0px">💀💀</div>
      <ng-template greeting-template let-data let-name>
        🚩{{ data.message }} 🙂{{ data.name }}
      </ng-template>
    </app-greeting-template>
  `,

  styles: [],
})
export class GreetingComponent {}
