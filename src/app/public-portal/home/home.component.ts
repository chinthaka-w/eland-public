import { Component, OnInit } from '@angular/core';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';
import {TranslateService} from '@ngx-translate/core';
import {Languages} from '../../shared/enum/languages.enum';
import {AppConfig} from '../../shared/dto/app-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../shared/service/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  status: boolean = false;
  dropdown: boolean = false;
  langDropdown: boolean = false;
  appConfig: AppConfig;
  userName: any;
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

  constructor(public sysConfigService: SysConfigService,
              private router: Router,
              private route: ActivatedRoute,
              private sessionService: SessionService,
              public translate: TranslateService) {
    let cc = JSON.parse(window.sessionStorage.getItem("appConfig"));
    router.events.subscribe(event => {

      this.sysConfigService.appConfig.subscribe((config: AppConfig) => {
        this.appConfig = config;
      });

      this.userName = this.sessionService.getUser().nameEng;

      window.scroll(0,0);
    });

    console.log(cc);
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
