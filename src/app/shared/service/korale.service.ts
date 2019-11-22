import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KoraleService {

  public BASE_URL = 'http://localhost:9292/api/korale';
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headersJson} );
  }
}
