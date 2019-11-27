import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division.model';
import {Observable} from 'rxjs';

@Injectable()
export class DsDivisionService {
  public BASE_URL = 'http://localhost:9292/api/dsDivision';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  getAllDsDivisions(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/find', {headers: this.headersJson} );
  }

  findAll(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headersJson} );
  }


}
