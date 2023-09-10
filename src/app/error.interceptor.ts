import { Injectable, inject } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly snackBar = inject(MatSnackBar);
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.openSnackBar("Network related error! Please contact to admin");
        this.handleServerSideError(err);
        return throwError(() => err);
      })
    );
  }

  private handleServerSideError = (error: HttpErrorResponse) => {
    console.log(error);
    switch (error.status) {
      case 400:
        console.log("Bad Request, please try again later .");
        break;
      case 401:
        console.log("Unauthorized, please try again later.");
        break;
      case 403:
        console.log("Forbidden access is denied");
        break;
      case 404:
        console.log("Resource not found");
        break;
      case 500:
        console.log("Internal server error, please try again later.");
        break;
      default:
        console.log(error);
        break;
    }
  };

  private openSnackBar(message: string) {
    this.snackBar.open(message, "Undo", {
      duration: 3000,
    });
  }
}
