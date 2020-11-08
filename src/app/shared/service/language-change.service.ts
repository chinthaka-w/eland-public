import { DocumentResponseDto } from './../dto/document-response.dto';
import { StatusDTO } from './../dto/status-dto';
import { NameTitleDTO } from './../dto/name-title.dto';
import { Observable } from 'rxjs';
import { SysConfigService } from './sys-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LanguageChange} from '../dto/language-change.model';
import { LanguageRequest } from '../dto/language-request.model';
import { NewNotaryPaymentDetailDto } from '../dto/new-notary-payment-detail.dto';
import { NotaryRegistrationHistoryDto } from '../dto/notary-registration-history.dto';
import { WorkflowStageDocDto } from '../dto/workflow-stage-doc-dto';

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

  setBase64(code: any) {
    return btoa(code);
  }

  decodeBase64(code: any) {
    return atob(code);
  }

  getNameTitle(): Observable<NameTitleDTO[]> {
    return this.http.get<NameTitleDTO[]>(this.BASE_URL + 'nameTitle/');
  }

  getRegistrationDetails(id: number): Observable<LanguageChange> {
    return this.http.get<LanguageChange>(this.BASE_URL + 'additionLanguageRequest/notaryApplicantDetails/' + id);
  }

  loadSupportingDocs(workflowStage: string): Observable<WorkflowStageDocDto[]> {
    return this.http.get<WorkflowStageDocDto[]>(this.BASE_URL + 'supportingDocument/' + workflowStage);
  }

  saveLanguageChange(fileList: any, model: any): Observable<object> {
    const formData: FormData = new FormData();
    fileList.forEach(doc => {
      formData.append('file', doc.files, doc.fileType + '/' + doc.files.name);
    });
    formData.append('model', JSON.stringify(model));
    return this.http.post(this.BASE_URL + 'additionLanguageRequest/', formData);
  }

  getLanguageChangeRequests(id: number): Observable<LanguageRequest[]> {
    return this.http.get<LanguageRequest[]>(this.BASE_URL + 'additionLanguageRequest/getApplicantRequest/' + id);
  }

  getApplicationDetails(id: number): Observable<LanguageChange> {
    return this.http.get<LanguageChange>(this.BASE_URL + 'additionLanguageRequest/viewApplicantDetails/' + id );
  }

  getApplicationPaymentHistory(reqId: number): Observable<NewNotaryPaymentDetailDto[]> {
    return this.http.get<NewNotaryPaymentDetailDto[]>(this.BASE_URL + 'additionLanguageRequest/getNotaryPaymentHistory/' + reqId);
  }

  getApplicationRemarkHistory(reqId: number): Observable<NotaryRegistrationHistoryDto[]> {
    return this.http.get<NotaryRegistrationHistoryDto[]>(this.BASE_URL + 'additionLanguageRequest/getNotaryRequestHistory/' + reqId);
  }

  updateApplication(model: LanguageChange): Observable<StatusDTO> {
    return this.http.post<StatusDTO> (this.BASE_URL + 'additionLanguageRequest/update', model);
  }

  updateDocList(docList: DocumentResponseDto[]): Observable<StatusDTO> {
    const formdata: FormData = new FormData();
    docList.forEach(doc => {
      formdata.append('file', doc.files, doc.files.name + '|' + doc.docTypeId);
    });

    return this.http.post<StatusDTO>(this.BASE_URL + 'new-notary/documents', formdata);
  }
}
