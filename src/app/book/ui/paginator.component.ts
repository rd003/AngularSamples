import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
@Component({
  selector: "app-paginator",
  template: `
    <mat-paginator
      class="book-paginator"
      [length]="totalRecords"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 100]"
      aria-label="Select page"
      (page)="pageSelect.emit($event)"
    >
    </mat-paginator>
  `,
  styles: [
    `
      .book-paginator {
        margin-top: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Output() pageSelect = new EventEmitter<PageEvent>();
  @Input({ required: true }) totalRecords!: number;
}
