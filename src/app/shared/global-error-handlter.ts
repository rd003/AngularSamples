import { ErrorHandler, Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly snackBar = inject(MatSnackBar);
  handleError(error: any): void {
    debugger;
    this.openSnackBar("Oops! something went wrong");
    console.log(`Error :${error}`);
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, "Undo", {
      duration: 3000,
    });
  }
}
