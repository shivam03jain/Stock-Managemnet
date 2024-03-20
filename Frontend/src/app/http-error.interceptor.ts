// error.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor {
  constructor(private snackBar: MatSnackBar) {
    console.log("Hello world");
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = error.error.error;

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000, // Display for 5 seconds
          panelClass: ['mat-toolbar', 'mat-warn'], // Use 'mat-warn' for a red color, or customize the styles
        });

        return throwError(() => errorMessage);
      })
    );
  }
}