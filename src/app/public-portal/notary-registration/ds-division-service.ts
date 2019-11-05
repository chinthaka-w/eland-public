import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../../shared/model/gn-division';
import {Observable} from "rxjs";

@Injectable()
export class DsDivisionService {
  public BASE_URL = '';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private gnDivision: GnDivision;
  public constructor(private httpClient: HttpClient) {}

  getAllDsDivisions(): Observable<Object>{
    return this.httpClient.get('http://localhost:9292/api/dsDivision/find', {headers: this.headers} );
  }
}
