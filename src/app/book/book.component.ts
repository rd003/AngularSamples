import { Component, OnInit, inject } from "@angular/core";
import { BookService } from "./book.service";

@Component({
  selector: "app-book",
  template: ` <p>book works!</p> `,
  styles: [],
})
export class BookComponent implements OnInit {
  #bookService = inject(BookService);

  ngOnInit(): void {
    this.#bookService.getBooks().subscribe({
      next: (res) => console.log(res),
      error: console.log,
    });
  }
}
