import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(
    private snackBar: MatSnackBar,
    // private messageConfig: MatSnackBarConfig
  ) {
    // const setAutoHide: boolean = true;
    // const autoHide: number = 2000;
    // const horizontalPosition: MatSnackBarHorizontalPosition = "right";
    // const verticalPosition: MatSnackBarVerticalPosition = "bottom";

    // this.messageConfig.horizontalPosition = horizontalPosition;
    // this.messageConfig.verticalPosition = verticalPosition;
    // this.messageConfig.duration = setAutoHide ? autoHide : 0;

    // const simpleMsgConfig = {
    //   duration: 2000,
    //   horizontalPosition: "right",
    //   verticalPosition: "bottom"
    // }
  }

  success(message: string) {
    this.snackBar.open(message, '', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom', panelClass: 'snackbar-success'});
  }

  error(message: string) {
    this.snackBar.open(message, '', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom', panelClass: 'snackbar-error'});
  }

  warn(message: string) {
    this.snackBar.open(message, '', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom', panelClass: 'snackbar-warn'});
  }
}
