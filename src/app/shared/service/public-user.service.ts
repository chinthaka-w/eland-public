import { Injectable } from '@angular/core';
import {SysConfigService} from './sys-config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicUserService {

  public BASE_URL = SysConfigService.BASE_URL + 'publicUser/';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});


  public constructor(private httpClient: HttpClient) {
  }

  checkIfUsernameExists(username: any): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}existUserName/${username}`);
  }
}
