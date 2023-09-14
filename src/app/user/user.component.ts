import { Component, inject } from "@angular/core";
import { UserService } from "./user.service";
import { Observable, tap } from "rxjs";
import { UserModel } from "./user.model";

@Component({
  selector: "app-user",
  template: `
    <div style="width: 70%;margin:auto;">
      <h1>Users(using resolver)</h1>
      <ng-container *ngIf="users$ | async as users; else loading">
        <table mat-table [dataSource]="users">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Username</th>
            <td mat-cell *matCellDef="let user">{{ user.username }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let user">{{ user.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button
                mat-raised-button
                color="primary"
                [routerLink]="['/users', user.id, 'posts']"
              >
                Posts
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr
            mat-row
            *matRowDef="let myRowData; columns: columnsToDisplay"
          ></tr>
        </table>
      </ng-container>

      <ng-template #loading>Loading...</ng-template>
    </div>
  `,
  styles: [],
})
export class UserComponent {
  private readonly _userService = inject(UserService);
  users$: Observable<UserModel[]> = this._userService.getUsers();
  columnsToDisplay = ["name", "username", "email", "phone", "actions"];
}
