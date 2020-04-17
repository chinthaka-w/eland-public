import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/service/session.service';
import {Location} from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(
    private sessionService: SessionService,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (this.sessionService.getUser().id) {
      this.router.navigate(['/login']);
    }
  }

}
