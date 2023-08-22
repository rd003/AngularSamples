import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PostModel } from "./post.model";

@Component({
  selector: "app-post",
  template: `
    <h1>Posts</h1>
    <p>
      <button mat-raised-button color="accent" routerLink="/users">Back</button>
    </p>
    <mat-card
      class="example-card"
      *ngFor="let post of posts"
      style="margin-bottom: 20px;"
    >
      <mat-card-header>
        <div mat-card-avatar class="example-header-image"></div>
        <mat-card-title>{{ post.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>
          {{ post.body }}
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>LIKE</button>
        <button mat-button>SHARE</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
})
export class PostComponent {
  private readonly _route = inject(ActivatedRoute);
  posts: PostModel[] = this._route.snapshot.data["posts"];
}
