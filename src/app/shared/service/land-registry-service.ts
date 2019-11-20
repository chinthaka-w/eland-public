import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division';
import {Observable} from 'rxjs';
import { SysConfigService } from './sys-config.service';

@Injectable()
export class LandRegistryService {
  public BASE_URL = SysConfigService.BASE_URL+'/landRegistries';
  private headers;
  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  private gnDivision: GnDivision;
  public constructor(private httpClient: HttpClient) {}


  // tslint:disable-next-line:ban-types
  getAllLandRegistry(): Observable<Object> {
   return this.httpClient.get(this.BASE_URL + '/', {headers: this.headers} );
  }
}
