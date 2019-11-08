import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SystemValueService} from '../../../shared/common/system-value.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JudicialService {

  public BASE_URL = SystemValueService.BASE_URL;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }

  getAllLandRegistries(): Observable<any> {
    return this.httpClient.get(SystemValueService.BASE_URL + 'landRegistries/get' );
  }

  getAllJudicialZone(): Observable<any> {
    return this.httpClient.get(SystemValueService.BASE_URL + 'judicial/' );
  }

}
