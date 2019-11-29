import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PublicProfileEditComponent } from './profile/public-profile-edit/public-profile-edit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userType = 'notary';
  //userType = 'public';

  constructor() {}

  ngOnInit() {
  }

}
