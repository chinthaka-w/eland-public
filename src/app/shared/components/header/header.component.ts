import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { SysConfigService } from "../../service/sys-config.service";
import { AppConfig } from "../../dto/app-config.model";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  status: boolean = false;
  dropdown: boolean = false;
  appConfig: AppConfig;

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
    private route: ActivatedRoute
  ) {
    this.sysConfigService.layout.subscribe((config: AppConfig) => {
      this.appConfig = config;
    });
  }

  ngOnInit() {}

  logout() {
    this.sysConfigService.layout.emit({
      user: false,
      header: false,
      footer: false,
  });
    this.router.navigate([`/login`], { relativeTo: this.route });
  }
}
