import { WorkflowStageDocTypeDTO } from './../dto/workflow-stage-doc-type-dto';
import { Observable } from 'rxjs';
import { SysConfigService } from './sys-config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadPopupService {

  BASE_URL = SysConfigService.BASE_URL;

  constructor(private http: HttpClient) { }

  public getWorkflowStageDocuments(workflowStage: string): Observable<WorkflowStageDocTypeDTO[]> {
    return this.http.get<WorkflowStageDocTypeDTO[]>(this.BASE_URL + 'supportingDocument/' + workflowStage);
  }
}
