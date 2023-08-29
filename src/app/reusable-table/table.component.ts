import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  randBook,
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randProduct,
} from "@ngneat/falso";

@Component({
  selector: "app-table",
  template: `
    <h1>Users</h1>
    <app-table-layout [data]="users">
      <ng-template table-template-headers>
        <th>FirstName</th>
        <th>LastName</th>
        <th>Email</th>
        <th>Action</th>
      </ng-template>

      <ng-template table-template-rows let-row>
        <td>{{ row.firstname }}</td>
        <td>{{ row.lastname }}</td>
        <td>{{ row.email }}</td>
        <td>
          <a mat-raised-button color="warn" (click)="onDelete(row.firstname)"
            >Delete</a
          >
        </td>
      </ng-template>
    </app-table-layout>

    <h2>Books</h2>
    <app-table-layout [data]="books"></app-table-layout>

    <h2>Products</h2>
    <app-table-layout [data]="products">
      <ng-template table-template-headers>
        <th>Category</th>
        <th>Price</th>
        <th>Book Title</th>
      </ng-template>
    </app-table-layout>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  users = [
    {
      firstname: randFirstName(),
      lastname: randLastName(),
      email: randEmail(),
    },
    {
      firstname: randFirstName(),
      lastname: randLastName(),
      email: randEmail(),
    },
    {
      firstname: randFirstName(),
      lastname: randLastName(),
      email: randEmail(),
    },
  ];

  books = [
    { title: randBook().title, price: randNumber(), author: randBook().author },
    { title: randBook().title, price: randNumber(), author: randBook().author },
    { title: randBook().title, price: randNumber(), author: randBook().author },
    { title: randBook().title, price: randNumber(), author: randBook().author },
  ];

  products = [
    {
      title: randProduct().title,
      category: randProduct().category,
      price: randProduct().price,
    },
    {
      title: randProduct().title,
      category: randProduct().category,
      price: randProduct().price,
    },
    {
      title: randProduct().title,
      category: randProduct().category,
      price: randProduct().price,
    },
    {
      title: randProduct().title,
      category: randProduct().category,
      price: randProduct().price,
    },
  ];

  onDelete(data: any) {
    const wantTodelete = confirm("Do you want to delete record : " + data);
  }
}
