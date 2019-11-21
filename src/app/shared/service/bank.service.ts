import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division.model';
import {Observable} from 'rxjs';

@Injectable()
export class BankService {
  public BASE_URL = 'http://localhost:9292/api/bank/';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  getAllBanks(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'bankList', {headers: this.headers} );
  }
}
