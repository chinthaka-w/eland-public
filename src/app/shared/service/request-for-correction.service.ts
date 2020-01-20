import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class RequestForCorrectionService {
  public BASE_URL = 'http://localhost:9292/api/folioNo';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  /** get Current Request Status */
  getCurrentRequestNoStatus(number: string): Observable<Object>{
    return this.httpClient.get(this.BASE_URL + '/folioN/' +number, {responseType: 'json'});
  }
}
