import { Provider } from '@angular/core';

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './http-error.interceptor';

export const ErrorInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true };