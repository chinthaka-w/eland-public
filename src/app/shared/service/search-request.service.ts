import {Injectable} from '@angular/core';
import {SysConfigService} from './sys-config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SearchRequest} from '../dto/search-request.model';

@Injectable({
  providedIn: 'root'
})
export class SearchRequestService {

  public BASE_URL = `${SysConfigService.BASE_URL}searchRequest`;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  findAllByPublicUser(userId: number, userType: string): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/publicUser/${userId}/${userType}`, {headers: this.headersJson});
  }

  findLastRemark(id: number): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/LastRemark/${id}`, {headers: this.headersJson});
  }

  findById(id: number): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/${id}`, {headers: this.headersJson});
  }


  saveSearchRequest(searchRequest: SearchRequest): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/save`, searchRequest, {headers: this.headersJson});
  }

  updateSearchRequest(searchRequest: SearchRequest): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/update`, searchRequest, {headers: this.headersJson});
  }

  action(searchRequestAction: SearchRequest): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/actionUpdate`, searchRequestAction, {headers: this.headersJson});
  }

  getSearchResultsBySearchRequestId(requestId: any): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/searchResult/${requestId}`, {headers: this.headersJson});
  }
}
