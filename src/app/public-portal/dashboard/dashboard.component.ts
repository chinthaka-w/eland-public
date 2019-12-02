import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PublicProfileEditComponent } from './profile/public-profile-edit/public-profile-edit.component';
import { SessionService } from 'src/app/shared/service/session.service';
import { UserType } from 'src/app/shared/enum/user-type.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user;
  userType = UserType;

  constructor(
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.user = this.sessionService.getUser();
  }

}
