import { Component, OnInit } from '@angular/core';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  status: boolean = false;
  dropdown: boolean = false;

  clickEvent() {
    this.status = !this.status;
    this.dropdown = false;
  }

  constructor() {
    var cc = JSON.parse(window.sessionStorage.getItem("appConfig"));

    console.log(cc);
  }

  ngOnInit() {


  }

}
