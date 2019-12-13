import { WorkflowStageDocDto } from './../dto/workflow-stage-doc.dto';
import { NameTitleDTO } from './../dto/name-title.dto';
import { Observable } from 'rxjs';
import { SysConfigService } from './sys-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LanguageChange} from '../dto/language-change.model';
import { LanguageRequest } from '../dto/language-request.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageChangeService {
  private BASE_URL = SysConfigService.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'multipart/form-data'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Get name titles
   * @returns {Observable<NameTitleDTO[]>}
   */
  getNameTitle(): Observable<NameTitleDTO[]> {
    return this.http.get<NameTitleDTO[]>(this.BASE_URL + 'nameTitle/');
  }

  getRegistrationDetails(id: number): Observable<LanguageChange> {
    return this.http.get<LanguageChange>(this.BASE_URL + 'additionLanguageRequest/notaryApplicantDetails/' + id);
  }

  loadSupportingDocs(workflowStage: string): Observable<WorkflowStageDocDto[]> {
    return this.http.get<WorkflowStageDocDto[]>(this.BASE_URL + 'supportingDocument/' + workflowStage);
  }

  saveLanguageChange(formData: FormData): Observable<object> {
    return this.http.post(this.BASE_URL + 'additionLanguageRequest/', formData);
  }

  getLanguageChangeRequests(id: number): Observable<LanguageRequest[]> {
    return this.http.get<LanguageRequest[]>(this.BASE_URL + 'additionLanguageRequest/getApplicantRequest/' + id);
  }
}
