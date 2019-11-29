import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PublicProfileEditComponent } from './profile/public-profile-edit/public-profile-edit.component';
import { SessionService } from 'src/app/shared/service/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // userType = 'notary';
  userType = 'public';
  user;

  constructor(
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.user = this.sessionService.getUser();
  }

}
