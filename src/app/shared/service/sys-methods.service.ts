import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {DocumentDto} from '../dto/document-list';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SysMethodsService {

  constructor(private sanitizer: DomSanitizer,) {
  }

  public getBTOA(value: string): string {
    return btoa(value);
  }

  public getATOB(value: string): string {
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

    if (dayText > 500) dayText = dayText - 500;

    // Day Digit Validation
    if (dayText < 1 && dayText > 366) {
      return null;
    }
    // else {
    //
    //   //Month
    //   if (dayText > 335) {
    //     day = dayText - 335;
    //     month = '12';
    //   }
    //   else if (dayText > 305) {
    //     day = dayText - 305;
    //     month = '11';
    //   }
    //   else if (dayText > 274) {
    //     day = dayText - 274;
    //     month = '10';
    //   }
    //   else if (dayText > 244) {
    //     day = dayText - 244;
    //     month = '09';
    //   }
    //   else if (dayText > 213) {
    //     day = dayText - 213;
    //     month = '08';
    //   }
    //   else if (dayText > 182) {
    //     day = dayText - 182;
    //     month = '07';
    //   }
    //   else if (dayText > 152) {
    //     day = dayText - 152;
    //     month = '06';
    //   }
    //   else if (dayText > 121) {
    //     day = dayText - 121;
    //     month = '05';
    //   }
    //   else if (dayText > 91) {
    //     day = dayText - 91;
    //     month = '04';
    //   }
    //   else if (dayText > 60) {
    //     day = dayText - 60;
    //     month = '03';
    //   }
    //   else if (dayText < 32) {
    //     month = '01';
    //     day = dayText;
    //   }
    //   else if (dayText > 31) {
    //     day = dayText - 31;
    //     month = '02';
    //   }
    // }
    return `${year}-${moment().dayOfYear(dayText).format('MM-DD')}`;
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    if (typeof control.value !== 'string') return null;
    const isEmpty = (control.value || '').length === 0;
    if (isEmpty) return null;
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {'pattern': true};
  }

  public getBase64(file): string {

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      return reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    return '';
  }

  public getFileFromDocumentDTO(document: DocumentDto | any): File {
    let base64;
    if (document.fileBase64.split(',').length == 2)
      base64 = document.fileBase64.split(',')[1];
    else
      base64 = document.fileBase64.split(',')[0];

    const byteString = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {type: document.fileFormats});

    const file:any = new File([blob], document.fileName, {type: document.fileFormats});
    file.objectURL = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
    return file;
  }

  public getDocumentListWithFileFromDocumentListFileBase64(documentList: DocumentDto[]): DocumentDto[] {
    let documents: DocumentDto[] = [];
    if (documentList) {
      for (let document of documentList) {
        document.files = this.getFileFromDocumentDTO(document);
        documents.push(document);
      }
    }
    return documents;
  }

}
