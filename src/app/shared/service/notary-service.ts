import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Notary} from '../dto/notary.model';
import {Observable, of, throwError} from 'rxjs';
import {SysConfigService} from './sys-config.service';
import {NewNotaryPaymentDto} from "../dto/new-notary-payment.dto";
import {SupportDocResponseModel} from "../dto/support-doc-response.model";
import {Form} from "@angular/forms";
import {NewNotarySupportingDocDetailDto} from "../dto/new-notary-supporting-doc-detail.dto";
import {DocTypeDto} from "../dto/doc-type.dto";
import {NewNotaryRequestsCategorySearchDto} from "../dto/new-notary-requests-category-search.dto";
@Injectable()
export class NotaryService {
  public BASE_URL = SysConfigService.BASE_URL +'new-notary';

  public notaryDetails: Notary;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private notary: Notary;
  public constructor(private httpClient: HttpClient) {}

  // tslint:disable-next-line:ban-types
  saveNotaryDetails(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/' , formData);
  }

  /** Update New Notary Documents */
  updateSupportDocuments(formData: FormData) : Observable<any> {
    return this.httpClient.post(this.BASE_URL+'/documents',formData);
  }

  /** Update Registered Notary Details */
  updateNotaryDetails(notaries: Notary): Observable<Object> {
    return this.httpClient.post(this.BASE_URL + '/update' , notaries);
  }

  /** Save Payment Details Seperatly of registered notary */
  savePayments(model: NewNotaryPaymentDto): Observable<Object> {
    return this.httpClient.post(this.BASE_URL + '/payments/' , model);
  }

  /** Get Document Types of Notary */
  getDocumentTypes(): Observable<DocTypeDto[]>{
    return this.httpClient.get<DocTypeDto[]>(this.BASE_URL + '/documentTypes');
  }

  /** Get Notary RequestId by Login Notary Details */
  getNotaryRequestDetails(notaryId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/search/' + notaryId , {headers: this.headersJson})
  }

  // tslint:disable-next-line:ban-types
  findIfNotaryExist(nic: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + '/find/' + nic , {headers: this.headersJson} );
  }

  setNotaryDetails(notaryDetails: Notary) {
    this.notaryDetails = notaryDetails;
  }

  getNotaryDetails() {
    return this.notaryDetails;
  }

  getNotary(notaryId: number) {
    return this.httpClient.get(this.BASE_URL + '/findNotary/' + notaryId , {headers: this.headersJson} );
  }

  editProfile(notary: Notary) {
    return this.httpClient.post(this.BASE_URL + '/editProfile/' , notary);
  }

  updateAccountDetails(formData: FormData) {
    return this.httpClient.post(this.BASE_URL + '/updateAccount/' , formData);
  }

  uploadProfilePic(file: File, noteryId: number) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('notaryId', noteryId.toString());

    return this.httpClient.post(this.BASE_URL + '/uploadProfilePic/' , formdata );

  }

  loadProfilePic(notaryId: number): Observable<any> {
    return this.httpClient.post(this.BASE_URL + '/loadProfilePic', notaryId);
  }
}
