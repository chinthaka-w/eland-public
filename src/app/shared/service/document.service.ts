import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SysConfigService} from './sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  public BASE_URL = `${SysConfigService.BASE_URL}document`;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {
  }

  getDocumentById(docId: any): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}/getDocumentBy/${docId}`);
  }
}
