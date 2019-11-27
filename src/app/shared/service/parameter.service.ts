import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ParameterService {
  public BASE_URL = 'http://localhost:9292/api/parameter';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  getParameterValue(code: string) {
    return this.httpClient.get(this.BASE_URL + '/' + code, {headers: this.headers} );
  }

  getParameterizedAmountByCode(code: string) {
    return this.httpClient.get(this.BASE_URL + '/' + code, {headers: this.headers} );
  }
}
