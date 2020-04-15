import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SearchRequest} from '../dto/search-request.model';
import {SysConfigService} from './sys-config.service';
import {Observable} from 'rxjs';
import {ExtractRequest} from '../dto/extract-request.model';

@Injectable({
  providedIn: 'root'
})
export class ExtractRequestService {
  public BASE_URL = `${SysConfigService.BASE_URL }extractRequest`

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }
  findById(id: number): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/${id}`, {headers: this.headersJson});
  }

  findAllByPublicUser(userId: number, userType: string): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/publicUser/` + userId + '/' + userType, {headers: this.headersJson});
  }

  findLastRemark(id: number): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/LastRemark/${id}`, {headers: this.headersJson});
  }

  saveExtractRequest(extractRequest: ExtractRequest): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/save`, extractRequest, {headers: this.headersJson});
  }

  updateSearchRequest(extractRequest: ExtractRequest): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/update`, extractRequest, {headers: this.headersJson});
  }

  action(searchRequestAction: SearchRequest): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/actionUpdate`, searchRequestAction, {headers: this.headersJson});
  }
}
