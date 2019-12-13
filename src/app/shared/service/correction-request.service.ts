import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { correctionReq } from '../dto/correctionReq.model';
// import { correctionReq } from '../model/correctionReq.model';

@Injectable({
  providedIn: 'root'
})
export class CorrectionRequestService {


  // url types
  BASE_URL_WITH_JUDICIAL = 'http://localhost:9292/api/judicial-zone';
  BASE_URL_WITH_LAND_REGISTRY = 'http://localhost:9292/api/landRegistries';
  BASE_URL_WITH_CORRECTION_REQ = 'http://localhost:9292/api/folioCorrectionController';

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
  console.log(corrReq);
  return this.httpClient.post(this.BASE_URL_WITH_CORRECTION_REQ + '/' ,corrReq);
}


}
