import { RequestResponse } from './../dto/request-response.model';
import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LandRegistriesDTO} from "../dto/land-registries-dto";
import {CitizenDTO} from "../dto/citizen-dto";
import {PublicUserDTO} from "../dto/public-user-dto";
import {SysConfigService} from "./sys-config.service";
import {PaymentDto} from "../dto/payment-dto";
import {StatusDTO} from "../dto/status-dto";
import {WorkflowStageDocTypeDTO} from "../dto/workflow-stage-doc-type-dto";
import { RequestSearchDetailDTO } from '../dto/request-search.dto';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  paymentDetails = new EventEmitter<PaymentDto[]>();
  enableChanges = new EventEmitter<boolean>();
  citizenDto = new EventEmitter<CitizenDTO>();
  getAllLandRegistries(): Observable<Array<LandRegistriesDTO>> {
    return this.httpClient.get<Array<LandRegistriesDTO>>(this.BASE_URL + 'landRegistries/find', {headers: this.headers} );
  }

  updateCitizen(citizen: CitizenDTO): Observable<StatusDTO> {
    return this.httpClient.put<StatusDTO>(this.BASE_URL + 'citizen/update', citizen,{headers: this.headers} );
  }
  checkForValidUsername(publicUserDTO: PublicUserDTO): Observable<boolean> {
    return this.httpClient.post<boolean>(this.BASE_URL + 'publicUser/username', publicUserDTO,{headers: this.headers} );
  }
  saveCitizenAndFormData(fileList: Object, citizen: CitizenDTO): Observable<CitizenDTO> {

    const formData: FormData = new FormData();
    const keys = Object.keys(fileList);
    for (const key in keys) {
      for (const file of fileList[keys[key]]) {
        formData.append('file', file, keys[key] + '/' + file.name);
      }
    }
    formData.append('model', JSON.stringify(citizen));
    return this.httpClient.post<CitizenDTO>(this.BASE_URL + 'citizen/', formData,{headers: this.headers});

  }

  getApplicationDetails(citizenId: number): Observable<CitizenDTO> {
    return this.httpClient.get<CitizenDTO>(this.BASE_URL + 'citizen/viewRegistarion/' + citizenId, {headers: this.headers} );
  }

  updatePayment(citizen: CitizenDTO): Observable<PaymentDto> {
    return this.httpClient.post<PaymentDto>(this.BASE_URL + 'citizen/updatePayment', citizen,{headers: this.headers} );
  }

  getRelatedDocTypes(code: string): Observable<Array<WorkflowStageDocTypeDTO>> {
    return this.httpClient.get<Array<WorkflowStageDocTypeDTO>>(this.BASE_URL + 'supportingDocument/' + code, {headers: this.headers} );
  }

  updateSupportingDocs(fileList: Object, citizen: CitizenDTO): Observable<StatusDTO> {

    const formData: FormData = new FormData();
    const keys = Object.keys(fileList);
    for (const key in keys) {
      for (const file of fileList[keys[key]]) {
        formData.append('file', file, keys[key] + '/' + keys[key] + file.name);
      }
    }
    formData.append('model', JSON.stringify(citizen));
    return this.httpClient.post<StatusDTO>(this.BASE_URL + 'citizen/updateDocs', formData, {headers: this.headers});

  }

  getLastRemark(reqId: number): Observable<any> {
    return this.httpClient.get(this.BASE_URL + 'citizen/lastRemark/' + reqId);
  }

  getUploadedDocuments(citizenId: number): Observable<CitizenDTO> {
    return this.httpClient.get<CitizenDTO>(this.BASE_URL + 'citizen/viewDocs/' + citizenId);
  }

  completeAction(citizenDto: CitizenDTO): Observable<RequestResponse> {
    return this.httpClient.post<RequestResponse>(this.BASE_URL + 'citizen/setUserAction', citizenDto);
  }

  getPublicUserDetails(citizenId: number): Observable<RequestSearchDetailDTO> {
    return this.httpClient.get<RequestSearchDetailDTO>(this.BASE_URL + 'citizen/getUserDetails/' + citizenId);
  }

  setChangesEnable(result: boolean): void {
    this.enableChanges.emit(result);
  }

}
