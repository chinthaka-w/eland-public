import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class JudicialService {

  public BASE_URL = SysConfigService.BASE_URL;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }

  getAllLandRegistries(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'landRegistries/get' );
  }

  getAllJudicialZone(): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'judicial/' );
  }

}
