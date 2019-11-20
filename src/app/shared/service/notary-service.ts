import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Notary} from '../dto/notary';
import {Observable, of, throwError} from 'rxjs';


@Injectable()
export class NotaryService {
  public BASE_URL = 'http://localhost:9292/api/new-notary';
  private headers;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private notary: Notary;
  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  saveNotaryDetails(notaries: Notary): Observable<Object> {
    console.log(notaries);
    return this.httpClient.post(this.BASE_URL + '/', notaries, {responseType: 'text', headers: this.headers});
  }

  // tslint:disable-next-line:ban-types
  findIfNotaryExist(nic: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/find/' + nic , {headers: this.headers} );
  }
}
