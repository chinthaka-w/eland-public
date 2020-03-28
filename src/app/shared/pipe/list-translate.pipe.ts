import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';

@Pipe({
  name: 'listTranslate',
  pure: false
})
export class ListTranslatePipe implements PipeTransform, OnDestroy {

  private language: string;

  private changes$$: Subscription;

  constructor(private translateService: TranslateService) {
    this.onChangeLanguage();
    // this.language = this.translateService.currentLang;
    this.language = 'si';
    if (!this.language) this.language = this.translateService.defaultLang;
  }


  transform(eng: any, sin?: any, tam?: any): any {
    let value = "";
      switch (this.language) {
        case ('en'): {
          value = eng;
          break;
        }
        case ('si'): {
          value = sin;
          break;
        }
        case ('ta'): {
          value = tam;
          break;
        }
      }
      return value;
  }

  onChangeLanguage() {
    this.changes$$ = this.translateService.onLangChange.subscribe((lang) => {
      this.language = lang.lang;
      });
  }

  ngOnDestroy(): void {
    if (this.changes$$) {
      this.changes$$.unsubscribe();
    }
  }


}
