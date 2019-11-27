import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestViewComponent } from './request-view/request-view.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  dialogRef: any;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(RequestViewComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  

  ngOnInit() {
  }

}


// export class RequestViewComponent {
//   constructor(public dialogRef: MatDialogRef<RequestViewComponent>) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }