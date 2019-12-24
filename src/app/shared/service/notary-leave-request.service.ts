import { Injectable } from '@angular/core';
import {SysConfigService} from "./sys-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {NotaryLeaveRequestDTO} from "../dto/notary-leave-request-dto";
import {WorkflowStageDocTypeDTO} from "../dto/workflow-stage-doc-type-dto";

@Injectable({
  providedIn: 'root'
})
export class NotaryLeaveRequestService {
  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) { }

  makeLeaveRequest(fileList: Object, request: NotaryLeaveRequestDTO): Observable<NotaryLeaveRequestDTO> {
    const formData: FormData = new FormData();
    const keys = Object.keys(fileList);
    for (const key in keys) {
      for (const file of fileList[keys[key]]) {
        formData.append('file', file, keys[key] + '/' + file.name);
      }
    }
    formData.append('model', JSON.stringify(request));
    console.log(formData);
    return this.httpClient.post<NotaryLeaveRequestDTO>(this.BASE_URL + 'notaryLeave/', formData,{headers: this.headers});
  }

  getRelatedDocTypes(code: string): Observable<Array<WorkflowStageDocTypeDTO>> {
    return this.httpClient.get<Array<WorkflowStageDocTypeDTO>>(this.BASE_URL + 'supportingDocument/' + code, {headers: this.headers} );
  }
}
