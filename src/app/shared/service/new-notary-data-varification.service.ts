import {EventEmitter, Injectable} from "@angular/core";
import {Notary} from "../dto/notary.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NewNotaryRequestsCategorySearchDto} from "../dto/new-notary-requests-category-search.dto";
import {Observable} from "rxjs";
import {NewNotaryViewDto} from "../dto/new-notary-view.dto";
import {NewNotaryRegistrationRequest} from "../dto/new-notary-registration-request.model";
import {NewNotaryPaymentDetailDto} from "../dto/new-notary-payment-detail-dto";

@Injectable()
export class NewNotaryDataVarificationService {
  public BASE_URL = 'http://localhost:9292/api/newNotary';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public viewNotaryDetails: NewNotaryViewDto;
  public requestDetails: NewNotaryRegistrationRequest[];
  workflowStage = new EventEmitter<string>();
  public constructor(private httpClient: HttpClient) {}

  /**  get application details of the relevant notary */
  getNotaryDetails(notaryDetails: NewNotaryRequestsCategorySearchDto): Observable<NewNotaryViewDto>{
    return this.httpClient.post<NewNotaryViewDto>(this.BASE_URL + '/notaryWarrantApplicationDetail' , notaryDetails);
  }

  /** get payment details for notary-registration */
  getPaymentDetails(searchType: NewNotaryRequestsCategorySearchDto): Observable<NewNotaryPaymentDetailDto[]>{
    return this.httpClient.post<NewNotaryPaymentDetailDto[]>(this.BASE_URL + '/payment', searchType);
  }


  setNotaryDetails(viewDetails: NewNotaryViewDto) {
    this.viewNotaryDetails = viewDetails;
  }

  ViewNotaryDetails(){
    return this.viewNotaryDetails;
  }

  getRemarkDetailsByNotary(nic: string):Observable<Object>{
    return this.httpClient.get<Array<NewNotaryRegistrationRequest>>(this.BASE_URL + '/remark/' +nic, {responseType: 'json'});
  }

  setNotaryRequestDetails(requst: NewNotaryRegistrationRequest[]) {
    this.requestDetails = requst;
  }

  ViewRequestDetails() {
    console.log(this.requestDetails);
    return this.requestDetails;
  }

  /* set Work flow stage */
  setWorkflowStage(code: string){
    this.workflowStage.emit(code);
  }
}
