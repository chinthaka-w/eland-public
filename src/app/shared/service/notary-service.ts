import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Notary} from '../model/notary';
import {Observable} from 'rxjs';

@Injectable()
export class NotaryService {
  public BASE_URL = '';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private notary: Notary;
  public constructor(private httpClient: HttpClient) {}

  // saveNotaryDetails(notaries: Notary): Observable<Object> {
  //   // return this.httpClient.post(this.BASE_URL + 'user/save/', notaries, {responseType: 'text', headers: this.headers});
  // }

  getAllDsDivisions(): Observable<Object> {
    return this.httpClient.get('api/dsDivision/all', {headers: this.headers} );
  }

  getAllLandRegistries(): Observable<Object> {
    return this.httpClient.get('api/landRegistries/', {headers: this.headers} );
  }
}
