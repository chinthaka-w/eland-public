import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload-popup',
  templateUrl: './file-upload-popup.component.html',
  styleUrls: ['./file-upload-popup.component.css']
})
export class FileUploadPopupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  uploadResponse(event: File[]): void {
    console.log(event);
  }

}
