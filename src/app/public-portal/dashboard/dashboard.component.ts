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
  // userType = 'public';

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(PublicProfileEditComponent, {
      width: '1200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}
