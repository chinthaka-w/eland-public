import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "../dto/app-config.model";

@Injectable({
  providedIn: "root"
})
export class SysConfigService {
  public static APP_ENDPOINT = "api/";
  public static APP_IP = "localhost:";
  public static APP_PROTOCOL = "http://";
  public static APP_PORT = "9292/";

  public static readonly BASE_URL =
    SysConfigService.APP_PROTOCOL +
    SysConfigService.APP_IP +
    SysConfigService.APP_PORT +
    SysConfigService.APP_ENDPOINT;

  layout = new EventEmitter<AppConfig>();




  constructor() {}

  set config(value) {
    window.sessionStorage.setItem("appConfig", JSON.stringify(value));
    this.layout.emit(value);
  }


  
  get config(): any | Observable<any> {
    return JSON.parse(window.sessionStorage.getItem("appConfig"));
  }
}
