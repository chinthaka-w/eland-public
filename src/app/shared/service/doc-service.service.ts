import { DocumentDTO } from './../dto/document-dto';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';
import { Observable } from 'rxjs';
import { DocMetaKey } from './../dto/doc-meta-key.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocServiceService {
  public DOC_BASE_URL = SysConfigService.BASE_URL + 'document';

  constructor(private http: HttpClient) { }

  getDocsByMeta(docMetaKeys: DocMetaKey[]): Observable<DocumentDTO[]> {
    return this.http.post<DocumentDTO[]>(this.DOC_BASE_URL + '/view', docMetaKeys);
  }
}
