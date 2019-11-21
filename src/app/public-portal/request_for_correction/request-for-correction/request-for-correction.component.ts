import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray} from '@angular/forms';
import { LandRegistry } from '../../../shared/model/land-registry';
import { PatternValidation } from '../../../shared/pattern-validation.enum';
import { CorrectionRequestService } from 'src/app/shared/service/correction-request.service';
import { judicialZone } from 'src/app/shared/model/judicialZone';
import { correctionReq } from 'src/app/shared/model/correctionReq.model';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-for-correction',
  templateUrl: './request-for-correction.component.html',
  styleUrls: ['./request-for-correction.component.css']
})
export class RequestForCorrectionComponent implements OnInit {

  public reqForCorrectionForm: FormGroup;
  public correctioReq: judicialZone[];
  public landReg: LandRegistry[];
  public correctionReqDetails: correctionReq;
  submitted = false;
  selected: any[];
  uploadSuccess: boolean;


  judicialzone: any;
  landRegs: any;


  message: string = 'Successfully Added';
  actionButtonLabel: string = 'Retry';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: 'right';
  verticalPosition: 'bottom';
  panelClass: 'snackbar-success';

  
  constructor(private correctionRequestService: CorrectionRequestService, private snackBar: MatSnackBar ) { }

  open() {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    this.snackBar.open(this.message, this.action ? this.actionButtonLabel : undefined, config);
  }

  ngOnInit() {
    this.reqForCorrectionForm = new FormGroup({
      requestedCorrection: new FormControl('', [Validators.required]),
      notaryName: new FormControl('', [Validators.required]),
      landRegId:new FormControl( Array(['']), [Validators.required]),
      judicialZoneId:new FormControl('', [Validators.required]),
      folioNumbers:new FormControl('', [Validators.required]),
      deedNo: new FormControl('', [Validators.required]),
      attestedDate: new FormControl(new Date(), [Validators.required]),
      natureOfTheCorrection: new FormControl(''),
      citizenId:new FormControl('1'),
      workflowStageCode:new FormControl('status'),
      remark:new FormControl('test remark'),
    });
    this.getjudicialZone();
    this.getLandRegistries();
    this.getAllCorrectionsToBeMade();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.reqForCorrectionForm.controls[controlName].hasError(errorName);
  }


  private getjudicialZone(): void {
    this.correctionRequestService.getAllJudicialZones().subscribe(res => {
      this.judicialzone = res;
    });
  }

  private getLandRegistries(): void {
    this.correctionRequestService.getLandRegistries().subscribe(res => {
      this.landRegs = res;
    });
  }

  private getAllCorrectionsToBeMade(): void {
    this.correctionRequestService.getLandRegistries().subscribe(res => {
      this.landRegs = res;
    });
  }


  onFormSubmit() {
    this.correctionRequestService.saveNotaryDetails(this.reqForCorrectionForm.value)
      .subscribe( res => {
        console.log("result ",res);
      this.open();
      });
  }



}