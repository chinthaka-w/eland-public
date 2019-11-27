import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable()
export class ParameterService {
  public BASE_URL = SysConfigService.BASE_URL +'parameter';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  getParameterValue(code: string) {
    return this.httpClient.get(this.BASE_URL + '/' + code, {headers: this.headersJson} );
  }

  getParameterizedAmountByCode(code: string) {
    return this.httpClient.get(this.BASE_URL + '/' + code, {headers: this.headersJson} );
  }
}
