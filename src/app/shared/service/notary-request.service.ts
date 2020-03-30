import {SysConfigService} from './sys-config.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class NotaryRequestService {

  public BASE_URL = SysConfigService.BASE_URL + 'notaryRequest';
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  findRequestByNotaryAndWorkFlow(id, workFlow): Observable<any> {
    const parameters = {
      params: {
        id,
        workFlow,
      },
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    };
    return this.httpClient.get(this.BASE_URL + '/', parameters);
  }
}
