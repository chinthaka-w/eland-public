import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SysConfigService} from './sys-config.service';
import {UserTypeModel} from '../dto/userType.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public BASE_URL = SysConfigService.BASE_URL3;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  });

  constructor(private httpClient: HttpClient) {
  }

  login({username, password}): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}publicUser/signin`, {username, password}, {
      headers: this.headers
    });
  }

  sendPasswordResetEmail(email): Observable<Array<any>> {
    return this.httpClient.post<Array<any>>(this.BASE_URL + 'systemUsers/passwordReset', email, {headers: this.headers} );
  }

  checkEmail(model: UserTypeModel): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}systemUsers/publicUserByEmail/`, model);
  }

  resetPassword(request): Observable<Array<any>> {
    return this.httpClient.post<Array<any>>(this.BASE_URL + 'systemUsers/resetPassword', request);
  }

}
