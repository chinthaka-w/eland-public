import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class VillageService {
  public BASE_URL = SysConfigService.BASE_URL +'village';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/', {headers: this.headersJson});
  }

  findAllByGnDivision(gnDivisionId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/gnDivision/' + gnDivisionId, {headers: this.headersJson});
  }
}
