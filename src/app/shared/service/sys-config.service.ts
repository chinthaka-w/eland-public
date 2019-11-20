import { Injectable } from '@angular/core';
import { config } from 'rxjs';
import { AppConfig } from '../dto/app-config.model';

@Injectable({
  providedIn: 'root'
})

export class SysConfigService {

  private config: AppConfig;

  constructor() { }

  appBarConfig(){

    // this.config.color = 'blue';
    return config;
  }
}
