import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


export interface PeriodicElement {
  division: string;
  volNo: number;
  folioNo: number;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {volNo: 10, division: 'AA', folioNo: 1105, status: 'Pending'},
  {volNo: 12, division: 'BB', folioNo: 3406, status: 'Pending'},
  // {volNo: 20, division: 'CC', folioNo: 3300, status: 'Approved'},
];

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})

export class RequestViewComponent implements OnInit {

  displayedColumns: string[] = [ 'division', 'volNo', 'folioNo', 'status'];
  dataSource = ELEMENT_DATA;

  constructor(public dialogRef: MatDialogRef<RequestViewComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
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