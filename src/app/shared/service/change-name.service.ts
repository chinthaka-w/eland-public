import {SysConfigService} from "./sys-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChangeNameService {
  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }

  getNameChangeRequest(notaryId: number): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'name-change/changeRequest/' , notaryId, {headers: this.headers} );
  }

  getNameChangeRequestData(requestId: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'name-change/getRequestDetails/' + requestId.toString() , {headers: this.headers});
  }

  save(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'name-change/submitChangeRequest/' , formData );
  }
}
