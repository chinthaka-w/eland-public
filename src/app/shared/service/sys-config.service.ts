import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "../dto/app-config.model";

@Injectable({
  providedIn: "root"
})
export class SysConfigService {
  public static APP_ENDPOINT = "api/";
  public static APP_ENDPOINT2 = "authorize/";
  public static APP_IP = `${window.location.href.split('/')[2].split(':')[0]}:`;
  public static APP_PROTOCOL = "http://";
  public static APP_PORT = "9494/";
  // online payment configs
  public static LGPS_PAYMENT_URL = 'https://testlgps.lankagate.gov.lk/lgps/accesslgps?clientPaymentRequest=';
  // public static LGPS_PAYMENT_URL = 'https://lgps.lankagate.gov.lk/lgps/accesslgps?clientPaymentRequest=';
  public static LGPS_SERVICE_CODE = 'TEST10001';
  // public static LGPS_SERVICE_CODE = 'RGDDMS0001';

  public static readonly BASE_URL =
    SysConfigService.APP_PROTOCOL +
    SysConfigService.APP_IP +
    SysConfigService.APP_PORT +
    SysConfigService.APP_ENDPOINT;

  public static readonly BASE_URL2 = SysConfigService.APP_PROTOCOL +
    SysConfigService.APP_IP +
    SysConfigService.APP_PORT;

  public static readonly BASE_URL3 =
    SysConfigService.APP_PROTOCOL +
    SysConfigService.APP_IP +
    SysConfigService.APP_PORT +
    SysConfigService.APP_ENDPOINT2;

  appConfig = new EventEmitter<AppConfig>();

  constructor() {}

  set config(value) {
    window.localStorage.setItem("appConfig", JSON.stringify(value));
    this.appConfig.emit(value);
  }

  get config(): any | Observable<any> {
    return JSON.parse(window.localStorage.getItem("appConfig"));
  }
}
