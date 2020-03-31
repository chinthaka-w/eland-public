import { CorrectionRequest } from './../dto/correction-request.model';
import { RequestResponse } from './../dto/request-response.model';
import { SysConfigService } from './sys-config.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { correctionReq } from '../model/correctionReq.model';

@Injectable({
  providedIn: 'root'
})
export class CorrectionRequestService {

  BASE_URL = SysConfigService.BASE_URL;

  // url types
  BASE_URL_WITH_JUDICIAL = this.BASE_URL + 'judicial-zone';
  BASE_URL_WITH_LAND_REGISTRY = this.BASE_URL + 'landRegistries';
  FOLIO_CORRECTION_URL = this.BASE_URL + 'folioCorrection';

  private headers;
  private headersJson = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });


  constructor(private http: HttpClient) { }


  //get all judicial zones names
  public getAllJudicialZones(): Observable<Object> {
    return this.http.get(this.BASE_URL_WITH_JUDICIAL + '/', { headers: this.headers });
  }

  //get all land registries names
  public getLandRegistries(): Observable<Object> {
    return this.http.get(this.BASE_URL_WITH_LAND_REGISTRY + '/', { headers: this.headers });
  }

  //get all corrections to be made
  public getAllCorrectionToBeMade(): Observable<Object> {
    return this.http.get(this.BASE_URL_WITH_LAND_REGISTRY + '/', { headers: this.headers });
  }

 // save correction request
 saveCorrectionReq(correctionRequest: CorrectionRequest): Observable<any> {
  return this.http.post(this.FOLIO_CORRECTION_URL + '/' , correctionRequest);
}

// get correction requests
getFolioCorrectionRequests(id: number): Observable<RequestResponse> {
  return this.http.get<RequestResponse>(this.FOLIO_CORRECTION_URL + '/getAll/' + id);
}

}
