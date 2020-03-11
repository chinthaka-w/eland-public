import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { correctionReq } from '../dto/correctionReq.model';
import {SysConfigService} from './sys-config.service';
// import { correctionReq } from '../model/correctionReq.model';

@Injectable({
  providedIn: 'root'
})
export class CorrectionRequestService {


  // url types
  BASE_URL_WITH_JUDICIAL = SysConfigService.BASE_URL +'judicial-zone';
  BASE_URL_WITH_LAND_REGISTRY = SysConfigService.BASE_URL +'landRegistries';
  BASE_URL_WITH_CORRECTION_REQ = SysConfigService.BASE_URL +'folioCorrectionController';

  private headers;
  private headersJson = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });


  constructor(private httpClient: HttpClient) { }


  //get all judicial zones names
  public getAllJudicialZones(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL_WITH_JUDICIAL + '/', { headers: this.headers });
  }

  //get all land registries names
  public getLandRegistries(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL_WITH_LAND_REGISTRY + '/', { headers: this.headers });
  }

  //get all corrections to be made
  public getAllCorrectionToBeMade(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL_WITH_LAND_REGISTRY + '/', { headers: this.headers });
  }

 // save correction request
 saveCorrectionReq(corrReq: FormData): Observable<any> {
  return this.httpClient.post(this.BASE_URL_WITH_CORRECTION_REQ + '/' ,corrReq);
}


}
