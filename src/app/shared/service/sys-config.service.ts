import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "../model/app-config.model";

@Injectable({
  providedIn: "root"
})
export class SysConfigService {

  getConfig = new EventEmitter<AppConfig>();

  constructor() {
  }

  set config(value) {
    window.sessionStorage.setItem('appConfig', JSON.stringify(value));
    this.getConfig.emit(value);
  }

  get config(): any | Observable<any> {
    return  JSON.parse(window.sessionStorage.getItem('appConfig'));
  }
}
