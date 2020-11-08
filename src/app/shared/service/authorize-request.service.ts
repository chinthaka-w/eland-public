import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SysConfigService} from './sys-config.service';
import {PaymentDto} from '../dto/payment-dto';
import {PaymentResponse} from '../dto/payment-response.model';
import {RequestResponse} from '../dto/request-response.model';
import {UserTypeModel} from '../dto/userType.model';
import {BankDTO} from '../dto/bank-dto';
import {LandRegistriesDTO} from '../dto/land-registries-dto';
import {WorkflowStageDocTypeDTO} from '../dto/workflow-stage-doc-type-dto';
import {CitizenDTO} from '../dto/citizen-dto';
import {PublicUserDTO} from '../dto/public-user-dto';
import {Notary} from '../dto/notary.model';
import {TempData} from '../dto/temp-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeRequestService {

  public BASE_URL = SysConfigService.BASE_URL3;

  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  constructor(private httpClient: HttpClient) {
  }

  /** New Notary Controller **/

  // tslint:disable-next-line:ban-types
  findIfNotaryExist(nic: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'new-notary/find/' + nic, {headers: this.headersJson});
  }

  // tslint:disable-next-line:ban-types
  saveNotaryDetails(fileList: any, notaryDTO: Notary): Observable<any> {
    const formData: FormData = new FormData();

    fileList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });
    formData.append('data', JSON.stringify(notaryDTO));

    return this.httpClient.post(this.BASE_URL + 'new-notary/', formData);
  }

  // tslint:disable-next-line:ban-types
  findEmailIfNotaryExist(email: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'new-notary/find/email/' + email, {headers: this.headersJson});
  }

  /** Public User Controller **/

  checkIfUsernameExists(username: any): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}publicUser/existUserName/${username}`);
  }

  checkForValidUsername(publicUserDTO: PublicUserDTO): Observable<boolean> {
    return this.httpClient.post<boolean>(this.BASE_URL + 'publicUser/username', publicUserDTO, {headers: this.headersJson});
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

  getAllLandRegistries(): Observable<Array<LandRegistriesDTO>> {
    return this.httpClient.get<Array<LandRegistriesDTO>>(this.BASE_URL + 'landRegistries/find', {headers: this.headersJson});
  }

  /** JudicialZone Controller **/

  getAllJudicialZone(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'judicial-zone/', {headers: this.headersJson});
  }

  /** NameTitle Controller **/

  findAllNameTitle(): Observable<Object> {
    return this.httpClient.get(`${this.BASE_URL}nameTitle/`, {headers: this.headersJson});
  }

  /** SupportingDocument Controller **/

  getDocuments(workflowCode: string): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'supportingDocument/' + workflowCode);
  }

  getRelatedDocTypes(code: string): Observable<any> {
    return this.httpClient.get<any>(this.BASE_URL + 'supportingDocument/' + code, {headers: this.headersJson});
  }

  /** Parameter Controller **/

  getParameterizedAmountByCode(code: string) {
    return this.httpClient.get(this.BASE_URL + 'parameter/' + code, {headers: this.headersJson});
  }

  /** Payment Controller **/

  savePayment(formData: FormData): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'payment/saveFileAndModel', formData);
  }

  savePayment2(paymentDto: PaymentDto): Observable<any> {
    return this.httpClient.post(this.BASE_URL + 'payment/saveModel', paymentDto);
  }

  confirmOnlinePayment(paymentDto: PaymentDto): Observable<PaymentResponse> {
    return this.httpClient.post<PaymentResponse>(this.BASE_URL + 'payment/payOnline', paymentDto);
  }

  // generateEmail(paymentData: PaymentDto)
  generateMail(mailData: PaymentDto): Observable<RequestResponse> {
    return this.httpClient.post<RequestResponse>(this.BASE_URL + 'payment/sendMail', mailData);
  }

  getOnlinePaymentResult(id: number): Observable<PaymentResponse> {
    return this.httpClient.get<PaymentResponse>(this.BASE_URL + 'payment/onlinePaymentResult/' + id);
  }

  /** Bank Controller **/

  findAllBanks(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'bank/bankList', {headers: this.headersJson});
  }

  getAllBanks(): Observable<Array<BankDTO>> {
    return this.httpClient.get<Array<BankDTO>>(this.BASE_URL + 'bank/bankList', {headers: this.headersJson});
  }

  findBankBranches(bankId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'bank/' + bankId);
  }

  /** Bank Branch Controller **/

  findAllByBankId(bankId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'bankBranch/bank/' + bankId, {headers: this.headersJson});
  }

  /** System Users Controller **/

  checkEmailSystemUser(model: UserTypeModel): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}systemUsers/publicUserByEmail/`, model);
  }

  sendPasswordResetEmail(email): Observable<Array<any>> {
    return this.httpClient.post<Array<any>>(this.BASE_URL + 'systemUsers/passwordReset', email, {headers: this.headersJson});
  }

  /** Citizen Controller **/

  saveCitizenAndFormData(fileList: any, citizen: CitizenDTO): Observable<CitizenDTO> {

    const formData: FormData = new FormData();

    fileList.forEach(doc => {
      formData.append('file', doc.files, doc.fileType + '/' + doc.fileType + doc.files.name);
    });
    formData.append('model', JSON.stringify(citizen));
    return this.httpClient.post<CitizenDTO>(this.BASE_URL + 'citizen/', formData, {headers: this.headers});

  }

  /** Temp Data Controller **/

  getTempDataById(id: any) : Observable<Object>{
    return this.httpClient.get(`${this.BASE_URL}tempData/${id}`, {headers: this.headersJson});
  }

  saveTempData(tempData: TempData): Observable<Object>{
    return this.httpClient.post(`${this.BASE_URL}tempData/`,tempData, {headers: this.headersJson});
  }

  updateTempData(tempData: TempData): Observable<Object>{
    return this.httpClient.put(`${this.BASE_URL}tempData/`,tempData, {headers: this.headersJson});
  }

  deleteTempData(id: any): Observable<Object>{
    return this.httpClient.delete(`${this.BASE_URL}tempData/${id}`, {headers: this.headersJson})
  }

}
