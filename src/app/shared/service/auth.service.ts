import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public BASE_URL = "http://localhost:9292/api/";
  private headers;
  private headersJson = new HttpHeaders({
    "Content-Type": "application/json; charset=utf-8"
  });

  constructor(private httpClient: HttpClient) {}

  login({username, password}): Observable<Object> {
    return this.httpClient.post(`${this.BASE_URL}/auth/login`,{username, password}, {
      headers: this.headers
    });
  }
}
