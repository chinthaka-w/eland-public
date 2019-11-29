import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class PaththuwaService {
  public BASE_URL = SysConfigService.BASE_URL +'paththuwa';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headersJson});
  }

  findAllByKoraleId(koraleId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/korale/'+koraleId, {headers: this.headersJson});
  }
}
