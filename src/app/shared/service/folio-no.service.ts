import {Injectable} from '@angular/core';
import {SysConfigService} from './sys-config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolioNoService {

  public BASE_URL = SysConfigService.BASE_URL + 'folioNo';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  // tslint:disable-next-line:ban-types
  findByFolioNo(folioNo: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/folioNo/'+folioNo, {headers: this.headersJson});
  }
}
