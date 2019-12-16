import {SysConfigService} from "./sys-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChangeNameService {
  public BASE_URL = SysConfigService.BASE_URL +'name-change';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }
  /** get all Name Change Request */
  getNameChangeRequest(notaryId: number): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/changeRequest/' , notaryId, {headers: this.headers} );
  }

  /** get Name Change Request by requestId */
  getNameChangeRequestData(requestId: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + '/getRequestDetails/' + requestId.toString() , {headers: this.headers});
  }

  /** save Name Change Request */
  save(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/submitChangeRequest/' , formData );
  }
}
