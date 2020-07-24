import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorageService} from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private tokenStorage:TokenStorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this.tokenStorage.getAccessToken() && !request.url.includes('oauth/token')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tokenStorage.getAccessToken()}`
        }
      });
    }

    return next.handle(request);
  }


}
