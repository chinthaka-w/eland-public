import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable()
export class JudicialZoneService {
  public BASE_URL = SysConfigService.BASE_URL +'judicial-zone';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  getAllJudicialZone(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headers} );
  }
}
