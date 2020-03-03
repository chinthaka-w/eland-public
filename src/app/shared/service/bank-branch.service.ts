import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable()
export class BankBranchService {
  public BASE_URL = SysConfigService.BASE_URL +'bankBranch';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  getAllBankBranchByBankId(branch: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/bank/' + branch , {headers: this.headersJson} );
  }

  findAllByBankId(bankId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/bank/' + bankId , {headers: this.headersJson} );
  }
}
