import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SysConfigService} from './sys-config.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameTitleService {

  public BASE_URL = `${SysConfigService.BASE_URL}nameTitle`;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/`, {headers: this.headersJson});
  }

}
