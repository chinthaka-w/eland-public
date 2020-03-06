import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { SysConfigService } from "../../service/sys-config.service";
import { AppConfig } from "../../dto/app-config.model";
import { Router, ActivatedRoute } from "@angular/router";
import { SessionService } from '../../service/session.service';
import {PublicUserDetails} from '../../dto/public-user-detail.model';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  status: boolean = false;
  dropdown: boolean = false;
  appConfig: AppConfig;
  userName: any;

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
    private sessionService: SessionService
  ) {
    router.events.subscribe(event => {
      this.sysConfigService.appConfig.subscribe((config: AppConfig) => {
        this.appConfig = config;
      });
  
      this.userName = this.sessionService.getUser().nameEng;
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
}
