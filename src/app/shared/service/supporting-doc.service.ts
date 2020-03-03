import {Injectable} from "@angular/core";
import {SysConfigService} from "./sys-config.service";
import {Notary} from "../dto/notary.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class SupportingDocService {
  public BASE_URL = SysConfigService.BASE_URL +'supportingDocument';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}


  /** Get  Doc Types to workflow */
  getDocuments(workflowCode: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + '/' +  workflowCode );
  }

  /** Get Notary Doc Types to workflow By WorkFlowStage */
  getDocumentsByWorkFlow(workflowCode: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + '/get/' +  workflowCode );
  }

}
