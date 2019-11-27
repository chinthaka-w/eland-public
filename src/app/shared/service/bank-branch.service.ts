import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BankBranchService {
  public BASE_URL = 'http://localhost:9292/api/bankBranch/';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  getAllBankBranchByBankId(branch: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'bank/' + branch , {headers: this.headers} );
  }
}
