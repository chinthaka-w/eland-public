import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LandRegistriesDTO} from "../dto/land-registries-dto";
import {CitizenDTO} from "../dto/citizen-dto";

@Injectable({
  providedIn: 'root'
})
export class CitizenService {

  public BASE_URL_LAND = 'http://localhost:9292/api/landRegistries/';
  public BASE_URL_CITIZEN = 'http://localhost:9292/api/citizen/';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  public constructor(private httpClient: HttpClient) {}

  getAllLandRegistries(): Observable<Array<LandRegistriesDTO>> {
    return this.httpClient.get<Array<LandRegistriesDTO>>(this.BASE_URL_LAND + 'find', {headers: this.headers} );
  }

  saveCitizen(citizen: CitizenDTO): Observable<CitizenDTO> {
    return this.httpClient.post<CitizenDTO>(this.BASE_URL_CITIZEN, citizen,{headers: this.headers} );
  }

}
