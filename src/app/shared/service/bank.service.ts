import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division.model';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable()
export class BankService {
  public BASE_URL = SysConfigService.BASE_URL +'bank';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  getAllBanks(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/bankList', {headers: this.headersJson} );
  }

  findAll(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headersJson} );
  }

}
