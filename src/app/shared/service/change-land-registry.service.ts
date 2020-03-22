import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SysConfigService} from './sys-config.service';
import {LanguageRequest} from '../dto/language-request.model';
import {ChangeLandRegistryDto} from '../dto/change-land-registry.dto';

@Injectable({
  providedIn: 'root'
})
export class ChangeLandRegistryService {

  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private http: HttpClient) { }

  getAllRequests(id: number): Observable<ChangeLandRegistryDto[]> {
    return this.http.get<ChangeLandRegistryDto[]>(this.BASE_URL + 'landRegistryChange/getLandRegistryChangeRequests/' + id);
  }

  save(formData: FormData): Observable<any> {
    return this.http.post(this.BASE_URL + 'landRegistryChange/submitChangeRequest/' , formData );
  }

}
