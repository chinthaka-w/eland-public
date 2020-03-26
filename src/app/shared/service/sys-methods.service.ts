import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SysMethodsService {

  constructor() { }

  getBTOA(value: string): string {
    return btoa(value);
  }

  getATOB(value: string): string {
    return atob(value);
  }

}
