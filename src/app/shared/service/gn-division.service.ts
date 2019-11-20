import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division.model';
import {Observable} from 'rxjs';
import { SysConfigService } from './sys-config.service';

@Injectable()
export class GnDivisionService {
  public BASE_URL = SysConfigService.BASE_URL+'/gnDivision';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private gnDivision: GnDivision;
  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  getAllGnDivisions(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headers} );
  }

  getAllGnDivisionsByDsDivisionId(dsDivisionId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/get/' + dsDivisionId, {headers: this.headers} );
  }
}
