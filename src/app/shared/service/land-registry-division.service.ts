import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandRegistryDivisionService {

  public BASE_URL = `${SysConfigService.BASE_URL}landRegistryDivision`;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }


  // tslint:disable-next-line:ban-types
  getAllByLandRegistryId(lrId: any): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/byLandRegistry/${lrId}`, {headers: this.headersJson});
  }
}
