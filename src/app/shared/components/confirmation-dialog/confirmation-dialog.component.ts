import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SystemService} from '../../service/system.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  title: string;
  message: string = this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT');
  confirmButtonText = this.systemService.getTranslation('BUTTONS.YES_BUTTON');
  cancelButtonText = this.systemService.getTranslation('BUTTONS.CANCEL_BUTTON');
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private systemService: SystemService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
    if(data){
      this.message = data.message || this.message;
      if(data.title) this.title = this.data.title;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  ngOnInit(): void {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }


}
