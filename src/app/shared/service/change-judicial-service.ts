import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class JudicialService {

  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }

  getAllLandRegistries(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'landRegistries/get' );
  }

  getDsDivision(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'dsDivision/findAll' );
  }

  getGnDivision(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'gnDivision/find' );
  }

  getAllJudicialZone(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'judicial-zone/' );
  }

  getJudicialChangeRequest(notaryId: number): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'judicial-zone/changeRequest/' , notaryId, {headers: this.headers} );
  }

  getDocuments(workflowCode: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'supportingDocument/' +  workflowCode, {headers: this.headers} );
  }

  getLanguages(notaryId: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'new-notary/getNotaryLanguage/' + notaryId.toString() , {headers: this.headers});
  }

}