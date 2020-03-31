import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SysConfigService} from './sys-config.service';

@Injectable()
export class RequestForCorrectionService {
  public BASE_URL = SysConfigService.BASE_URL +'folioNo';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}

  /** get Current Request Status */
  getCurrentRequestNoStatus(number: string): Observable<Object>{
    return this.httpClient.get(this.BASE_URL + '/folioN/' +number, {responseType: 'json'});
  }
}
