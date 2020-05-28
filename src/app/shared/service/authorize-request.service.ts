import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SysConfigService} from './sys-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeRequestService {

  public BASE_URL = SysConfigService.BASE_URL3;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }

  /** New Notary Controller **/

  // tslint:disable-next-line:ban-types
  findIfNotaryExist(nic: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'new-notary/find/' + nic, {headers: this.headersJson});
  }

  // tslint:disable-next-line:ban-types
  saveNotaryDetails(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'new-notary/', formData);
  }

/** Public User Controller **/

  checkIfUsernameExists(username: any): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}publicUser/existUserName/${username}`);
  }

  /** GN Division Controller **/

  getAllGnDivisionsByDsDivisionId(dsDivisionId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'gnDivision/get/' + dsDivisionId, {headers: this.headersJson});
  }

  /** DS Division Controller **/

  // tslint:disable-next-line:ban-types
  getAllDsDivisions(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'dsDivision/find', {headers: this.headersJson});
  }

  /** Land Registry Controller **/

  getLandRegistriesByJudicialId(id: any): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'landRegistries/byJudicialZoneId/' + id, {headers: this.headersJson});
  }

  /** JudicialZone Controller **/

  getAllJudicialZone(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'judicial-zone/', {headers: this.headersJson} );
  }

  /** NameTitle Controller **/

  findAllNameTitle(): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}nameTitle/`, {headers: this.headersJson});
  }

  /** SupportingDocument Controller **/

  getDocuments(workflowCode: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'supportingDocument/' +  workflowCode );
  }


}
