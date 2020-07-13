import { FileMeta } from './../dto/file-meta.model';
import { WorkflowStageDocTypeDTO } from './../dto/workflow-stage-doc-type-dto';
import { Observable } from 'rxjs';
import { SysConfigService } from './sys-config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestResponse } from '../dto/request-response.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadPopupService {

  BASE_URL = SysConfigService.BASE_URL;

  constructor(private http: HttpClient) { }

  public getWorkflowStageDocuments(workflowStage: string): Observable<WorkflowStageDocTypeDTO[]> {
    return this.http.get<WorkflowStageDocTypeDTO[]>(this.BASE_URL + 'supportingDocument/' + workflowStage);
  }

  updateDocuments(filesMeta: FileMeta[]): Observable<RequestResponse> {
    return this.http.post<RequestResponse>(this.BASE_URL + 'document/update', filesMeta);
  }

  updateAlreadyUploadedDocs(filesMeta: FileMeta[]): Observable<RequestResponse> {
    return this.http.post<RequestResponse>(this.BASE_URL + 'document/updateWithExist', filesMeta);
  }
}
