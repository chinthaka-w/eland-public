import {Injectable} from '@angular/core';
import {SysConfigService} from './sys-config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SearchRequest} from '../dto/search-request.model';

@Injectable({
  providedIn: 'root'
})
export class SearchRequestService {

  public BASE_URL = SysConfigService.BASE_URL + 'searchRequest';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  saveSearchRequest(searchRequest: SearchRequest): Observable<Object> {
    console.log('request: ',searchRequest);
    return this.httpClient.post(this.BASE_URL + '/save', searchRequest, {headers: this.headersJson});
  }
}
