import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SysMethodsService {

  constructor() {
  }

  getBTOA(value: string): string {
    return btoa(value);
  }

  getATOB(value: string): string {
    return atob(value);
  }

  getDateOfBirthByNic(NICNo: string): string {
    if (!NICNo) return null;

    let dayText = 0;
    let year = '';
    let month;
    let day;
    if (NICNo.length != 10 && NICNo.length != 12) {
      return null;
    } else if (NICNo.length == 10 && !Number(NICNo.substr(0, 9))) {
      return null;
    }

    // Year
    if (NICNo.length == 10) {
      year = '19' + NICNo.substr(0, 2);
      dayText = parseInt(NICNo.substr(2, 3));
    } else {
      year = NICNo.substr(0, 4);
      dayText = parseInt(NICNo.substr(4, 3));
    }

    // Day Digit Validation
    if (dayText < 1 && dayText > 366) {
      return null;
    } else {

      //Month
      if (dayText > 335) {
        day = dayText - 335;
        month = 12;
      }
      else if (dayText > 305) {
        day = dayText - 305;
        month = 11;
      }
      else if (dayText > 274) {
        day = dayText - 274;
        month = 10;
      }
      else if (dayText > 244) {
        day = dayText - 244;
        month = 9;
      }
      else if (dayText > 213) {
        day = dayText - 213;
        month = 8;
      }
      else if (dayText > 182) {
        day = dayText - 182;
        month = 7;
      }
      else if (dayText > 152) {
        day = dayText - 152;
        month = 6;
      }
      else if (dayText > 121) {
        day = dayText - 121;
        month = 5;
      }
      else if (dayText > 91) {
        day = dayText - 91;
        month = 4;
      }
      else if (dayText > 60) {
        day = dayText - 60;
        month = 3;
      }
      else if (dayText < 32) {
        month = 1;
        day = dayText;
      }
      else if (dayText > 31) {
        day = dayText - 31;
        month = 2;
      }
    }
    return `${year}-${month}-${day}`;
  }

}
