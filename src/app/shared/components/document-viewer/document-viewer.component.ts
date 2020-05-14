import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatCheckboxChange, MatDialog, MatDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {SearchDocumentResultComponent} from '../../../public-portal/dashboard/search-document/search-document-view/search-document-application/search-document-result/search-document-result.component';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {

  files: any = [];
  selectedFiles: any = [];

  canSelect = false;

  public viewerConfig = {
    btnClass: 'default', // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
    allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
      rotateCounterClockwise: 'fa fa-undo',
      next: 'fa fa-arrow-right',
      prev: 'fa fa-arrow-left',
      fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
      next: true,
      prev: true
    },
    // customBtns: [
    //   {
    //     name: 'rotateClockwise',
    //     icon: 'fa fa-repeat'
    //   },
    //   {
    //     name: 'rotateCounterClockwise',
    //     icon: 'fa fa-undo'
    //   }
    // ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<SearchDocumentResultComponent>,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer) {
    if (data) {
      this.files = data.files;
      if (data.canSelect) this.canSelect = data.canSelect;
    }
  }


  ngOnInit() {
  }

  transform(base64Image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

  onApply(){
    this.dialogRef.close(this.selectedFiles);
  }

  onSelectFile(data: MatCheckboxChange, file: any) {
    if (data.checked) {
      this.selectedFiles.push(file);
    } else {
      this.selectedFileRemoveFormArray(file.documentId);
    }
  }

  selectedFileRemoveFormArray(id: any) {
    let indx = this.selectedFiles.findIndex(item => item.documentId == id);
    this.selectedFiles.splice(indx, 1);
  }

}
