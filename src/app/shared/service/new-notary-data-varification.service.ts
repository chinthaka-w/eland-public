import {Injectable} from "@angular/core";
import {Notary} from "../dto/notary.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NewNotaryRequestsCategorySearchDto} from "../dto/new-notary-requests-category-search.dto";
import {Observable} from "rxjs";
import {NewNotaryViewDto} from "../dto/new-notary-view.dto";
import {NewNotaryRegistrationRequest} from "../dto/new-notary-registration-request.model";

@Injectable()
export class NewNotaryDataVarificationService {
  public BASE_URL = 'http://localhost:9292/api/newNotary';
  private headers;
  public notaryDetails: Notary;

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private viewNotaryDetails: NewNotaryViewDto;
  private requestDetails: NewNotaryRegistrationRequest[];
  public constructor(private httpClient: HttpClient) {}

  getNotaryDetails(notaryDetails: NewNotaryRequestsCategorySearchDto): Observable<Object>{
    return this.httpClient.post(this.BASE_URL + '/notaryWarrantApplicationDetail' , notaryDetails, {responseType: 'json', headers: this.headers});
  }

  setNotaryDetails(viewDetails: NewNotaryViewDto,request:NewNotaryRegistrationRequest[]) {
    this.viewNotaryDetails = viewDetails;
    this.requestDetails = request;
  }

  ViewNotaryDetails(){
    return this.viewNotaryDetails;
  }

  ViewRequestDetails() {
    return this.requestDetails;
  }

  getRemarkDetailsByNotary(nic: string):Observable<Object> {
    return this.httpClient.post(this.BASE_URL + '/remark/' +nic, { headers: this.headers});
  }
}
