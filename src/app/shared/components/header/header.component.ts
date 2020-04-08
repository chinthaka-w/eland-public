import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { SysConfigService } from "../../service/sys-config.service";
import { AppConfig } from "../../dto/app-config.model";
import { Router, ActivatedRoute } from "@angular/router";
import { SessionService } from '../../service/session.service';
import { PublicUserDetails } from '../../dto/public-user-detail.model';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from '../../enum/languages.enum';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  status: boolean = false;
  dropdown: boolean = false;
  langDropdown: boolean = false;
  appConfig: AppConfig;
  userName: any;
  isHome: boolean;
  isLogin: boolean;

  public languages = [
    {
      id: Languages.ENGLISH,
      label: 'English',
      code: 'en'
    },
    {
      id: Languages.SINHALA,
      label: 'සිංහල',
      code: 'si'
    },
    {
      id: Languages.TAMIL,
      label: 'தமிழ்',
      code: 'ta'
    }
  ];

  public selectedLanguage = this.languages[0];

  clickEvent() {
    this.status = !this.status;
    this.dropdown = false;
  }

  clickDropdown() {
    this.dropdown = !this.dropdown;
    this.status = false;
  }

  constructor(
    public sysConfigService: SysConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    public translate: TranslateService
  ) {
    router.events.subscribe(event => {

      if (event['url'] == '/home') {
        this.isHome = true;
        this.isLogin = false;
      }
      else if (event['url'] == '/login') {
        this.isHome = false;
        this.isLogin = true;
      }
      else if(event['url']){
        this.isHome = false;
        this.isLogin = false;
      }

      this.sysConfigService.appConfig.subscribe((config: AppConfig) => {
        this.appConfig = config;
      });

      this.userName = this.sessionService.getUser().nameEng;

      window.scroll(0, 0);
    });

  }

  ngOnInit() {
    this.sysConfigService.appConfig.subscribe((config: AppConfig) => {
      this.appConfig = config;
    });


  }

  logout() {

    this.sessionService.removeUser();

    this.sysConfigService.appConfig.emit({
      user: false,
      header: false,
      footer: false
    });
    this.router.navigate([`/login`], { relativeTo: this.route });
  }

  changeLanguage(lang) {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    this.clickLangDropdown();
  }

  clickLangDropdown() {
    this.langDropdown = !this.langDropdown;
  }
}
