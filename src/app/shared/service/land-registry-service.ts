import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GnDivision} from '../dto/gn-division';
import {Observable} from 'rxjs';

@Injectable()
export class LandRegistryService {
  public BASE_URL = 'http://localhost:9292/api/landRegistries';

  private headersJson = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

  public constructor(private httpClient: HttpClient) {}


  // tslint:disable-next-line:ban-types
  getAllLandRegistry(): Observable<Object> {
   return this.httpClient.get(this.BASE_URL + '/', {headers: this.headersJson} );
  }
}
