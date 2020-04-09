import { PaymentDto } from './../dto/payment-dto';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';
import {JudicialChange} from '../dto/judicial-change-model';

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

  getAllLandRegistriesByJudicialZone(userId: number): Observable <any> {
    return this.httpClient.get(this.BASE_URL + 'landRegistries/getList/' + userId );
  }

  getDsDivision(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'dsDivision/findAll' );
  }

  getGnDivision(dsDivisionId: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'gnDivision/get/' + dsDivisionId , {headers: this.headers});
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

  save(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'judicial-zone/submitChangeRequest/' , formData );
  }

  getRequestData(requestId: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'judicial-zone/getRequestDetails/' + requestId.toString() , {headers: this.headers});
  }

  update(judicialChangeDto: JudicialChange): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'judicial-zone/update/' , judicialChangeDto ,{headers: this.headers} );
  }

  findLastRemark(id: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'judicial-zone/getLastRemark/' + id, {headers: this.headersJson});
  }

  getLandRegistriesByJudicialZone(judicialCode: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'location/landRegistry/byJudicial/' + judicialCode);
  }

  setUserAction(judicialData: JudicialChange): Observable<any> {
    return this.httpClient.post<any>(this.BASE_URL + 'judicial-zone/setAction', judicialData);
  }

}
