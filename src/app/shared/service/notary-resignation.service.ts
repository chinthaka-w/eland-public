import { Injectable } from '@angular/core';
import {SysConfigService} from "./sys-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CitizenDTO} from "../dto/citizen-dto";
import {Observable} from "rxjs";
import {NotaryResignationDto} from "../dto/notary-resignation-dto";
import {WorkflowStageDocTypeDTO} from "../dto/workflow-stage-doc-type-dto";
import {StatusDTO} from "../dto/status-dto";

@Injectable({
  providedIn: 'root'
})
export class NotaryResignationService {
  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  constructor(private httpClient: HttpClient) { }

  /** Make resignation request */
  makeDesignationRequest(fileList: Object, dto: NotaryResignationDto): Observable<StatusDTO> {
    const formData: FormData = new FormData();
    const keys = Object.keys(fileList);
    for (const key in keys) {
      for (const file of fileList[keys[key]]) {
        formData.append('file', file, keys[key] + '/' + file.name);
      }
    }
    formData.append('model', JSON.stringify(dto));
    return this.httpClient.post<StatusDTO>(this.BASE_URL + 'notaryResignation/', formData,{headers: this.headers});
  }

  getRelatedDocTypes(code: string): Observable<Array<WorkflowStageDocTypeDTO>> {
    return this.httpClient.get<Array<WorkflowStageDocTypeDTO>>(this.BASE_URL + 'supportingDocument/' + code, {headers: this.headers} );
  }

  getResignationByNoatry(id){
    return this.httpClient.get(this.BASE_URL + 'notaryResignation/byNotary/' + id, {headers: this.headers} );
  }
}
