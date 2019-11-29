import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LandRegistriesDTO} from "../dto/land-registries-dto";
import {CitizenDTO} from "../dto/citizen-dto";
import {PublicUserDTO} from "../dto/public-user-dto";

@Injectable({
  providedIn: 'root'
})
export class CitizenService {

  public BASE_URL_LAND = 'http://localhost:9292/api/landRegistries/';
  public BASE_URL_CITIZEN = 'http://localhost:9292/api/citizen/';
  public BASE_URL_PUBLIC_USER = 'http://localhost:9292/api/publicUser/';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  getAllLandRegistries(): Observable<Array<LandRegistriesDTO>> {
    return this.httpClient.get<Array<LandRegistriesDTO>>(this.BASE_URL_LAND + 'find', {headers: this.headers} );
  }

  saveCitizen(citizen: CitizenDTO): Observable<CitizenDTO> {
    return this.httpClient.post<CitizenDTO>(this.BASE_URL_CITIZEN, citizen,{headers: this.headers} );
  }
  checkForValidUsername(publicUserDTO: PublicUserDTO): Observable<boolean> {
    return this.httpClient.post<boolean>(this.BASE_URL_PUBLIC_USER + 'username', publicUserDTO,{headers: this.headers} );
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
    return this.httpClient.post<CitizenDTO>(this.BASE_URL_CITIZEN, formData,{headers: this.headers});

    // return this.httpClient.post<CitizenDTO>(this.BASE_URL_CITIZEN, formData,{headers: this.headers} );
  }

}
