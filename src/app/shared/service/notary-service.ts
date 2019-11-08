import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Notary} from '../model/notary';
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
    alert(notaries);
    console.log(notaries)
    return this.httpClient.post(this.BASE_URL + '/', notaries, {responseType: 'text', headers: this.headers});
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  private log(message: string) {

  }
}
