import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from localStorage
    const authToken = localStorage.getItem('authToken');
    
    // Clone the request and add the authorization header if the token exists
    if (authToken) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Token ${authToken}`,
        }
      });
      return next.handle(clonedRequest);
    }

    // If no token, send the request as is
    return next.handle(req);
  }
}
