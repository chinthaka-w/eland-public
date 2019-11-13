import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../model/gn-division';
import {Observable} from 'rxjs';

@Injectable()
export class GnDivisionService {
  public BASE_URL = 'http://localhost:9292/api/gnDivision';
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
