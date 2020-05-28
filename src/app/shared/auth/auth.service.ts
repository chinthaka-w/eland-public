import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SysConfigService} from '../service/sys-config.service';
import {Router} from '@angular/router';
import {TokenStorageService} from './token-storage.service';
import {catchError, map, mapTo, tap} from 'rxjs/operators';

const CLIENT_ID = 'eland_public';
const CLIENT_SECRET = 'public';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public BASE_URL = SysConfigService.BASE_URL;
  private BASE_URL2 = SysConfigService.BASE_URL2;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  });

  constructor(private httpClient: HttpClient,
              private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  attemptAuth(username: string, password: string): Observable<Object> {

    let body = new FormData();
    body.append('grant_type', 'password');
    body.append('username', `${username}:PublicUser`);
    body.append('password', password);


    let options = {
      headers: {
        'Type': 'password',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
      }
    };
    return this.httpClient.post(this.BASE_URL2 + 'oauth/token', body, options).pipe(
      tap((tokens: any) => {
        if (tokens) {
          this.tokenStorageService.saveAccessToken(tokens.access_token);
          this.tokenStorageService.saveRefreshToken(tokens.refresh_token);
        }
      }));
  }

  refreshAccessToken(): Observable<Object> {
    let body = new FormData();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', this.tokenStorageService.getRefreshToken());

    let options = {
      headers: {
        'Type': 'refresh_token',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
      }
    };
    return this.httpClient.post(this.BASE_URL2 + 'oauth/token', body, options).pipe(
      tap((tokens: any) => {
        if (tokens) {
          this.tokenStorageService.saveAccessToken(tokens.access_token);
          this.tokenStorageService.saveRefreshToken(tokens.refresh_token);
        }
      }));

  }

  getUserDetails(userName: any): Observable<Object> {

    let body = new URLSearchParams();
    body.set('username', userName.toString());
    body.set('type', 'PublicUser');
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.httpClient.post(`${this.BASE_URL2}auth/user/`, body.toString(), options);
  }

  login({username, password}): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}publicUser/signin`, {username, password}, {
      headers: this.headers
    });
  }

  logout() {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
