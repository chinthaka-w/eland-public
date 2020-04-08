import { Component, OnInit } from '@angular/core';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from 'src/app/shared/enum/languages.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  status: boolean = false;
  dropdown: boolean = false;
  langDropdown: boolean = false;

  public languages = [
    {
        id   : Languages.ENGLISH,
        label: 'English',
        code: 'en'
    },
    {
        id   : Languages.SINHALA,
        label: 'සිංහල',
        code: 'si'
    },
    {
        id   : Languages.TAMIL,
        label: 'தமிழ்',
        code: 'ta'
    }
];

public selectedLanguage = this.languages[0];

  clickEvent() {
    this.status = !this.status;
    this.dropdown = false;
  }

  constructor(
    public translate: TranslateService
  ) {
    
  }

  ngOnInit() {

  }


  changeLanguage(lang){
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    this.clickLangDropdown();
  }

  clickLangDropdown(){
    this.langDropdown = !this.langDropdown;
  }

}
