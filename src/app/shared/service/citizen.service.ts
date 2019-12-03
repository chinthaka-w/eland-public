import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LandRegistriesDTO} from "../dto/land-registries-dto";
import {CitizenDTO} from "../dto/citizen-dto";
import {PublicUserDTO} from "../dto/public-user-dto";
import {SysConfigService} from "./sys-config.service";
import {PaymentDto} from "../dto/payment-dto";

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  public BASE_URL = SysConfigService.BASE_URL;
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  paymentDetails = new EventEmitter<PaymentDto[]>();
  getAllLandRegistries(): Observable<Array<LandRegistriesDTO>> {
    return this.httpClient.get<Array<LandRegistriesDTO>>(this.BASE_URL + 'landRegistries/find', {headers: this.headers} );
  }

  saveCitizen(citizen: CitizenDTO): Observable<CitizenDTO> {
    return this.httpClient.post<CitizenDTO>(this.BASE_URL + 'citizen/', citizen,{headers: this.headers} );
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
        // console.log(formData.get(keys[key]));
        // dataObj.push(formData);
      }
      // console.log(fileList[keys[key]]);
      // for(const file in fileList[key]) {
      //   console.log(file);
      // }
    }
    formData.append('model', JSON.stringify(citizen));
    console.log(formData);
    // **console.log('file: ', fileList[keys[0]][0]);
    // for (const key in keys) {
    // console.log(fileList[key]);
    // for (let file in fileList[key]) {
    //   console.log(file);
    // }
    // }
    return this.httpClient.post<CitizenDTO>(this.BASE_URL + 'citizen/', formData,{headers: this.headers});

  }

  getApplicationDetails(citizenId: number): Observable<CitizenDTO> {
    return this.httpClient.get<CitizenDTO>(this.BASE_URL + 'citizen/' + citizenId, {headers: this.headers} );
  }

}
