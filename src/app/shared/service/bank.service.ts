import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division.model';
import {Observable} from 'rxjs';
import {Bank} from "../dto/bank.model";
import {BankDTO} from "../dto/bank-dto";

@Injectable()
export class BankService {
  public BASE_URL = 'http://localhost:9292/api/bank/';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  getAllBanks(): Observable<Array<BankDTO>> {
    return this.httpClient.get<Array<BankDTO>>(this.BASE_URL + 'bankList', {headers: this.headers} );
  }
}
