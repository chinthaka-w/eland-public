import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private translate: TranslateService) { }

  getTranslation(key: string): string {
    let text;
    this.translate.get(key).subscribe(
        value => {
            text = value;
            return value;
        });
    return text;
}

}
