import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LandRegistry } from '../../../shared/model/land-registry';
import { PatternValidation } from '../../../shared/pattern-validation.enum';
import { CorrectionRequestService } from 'src/app/shared/service/correction-request.service';
import { judicialZone } from 'src/app/shared/model/judicialZone';
import { correctionReq } from 'src/app/shared/model/correctionReq.model';

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

  constructor(private correctionRequestService: CorrectionRequestService, ) { }

  ngOnInit() {
    this.reqForCorrectionForm = new FormGroup({
      reqCorrectiontobeMade: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
      notaryName: new FormControl('', [Validators.required]),
      deedNo: new FormControl('', [Validators.required]),
      passedDate: new FormControl(new Date(), [Validators.required]),
      attestedDate: new FormControl(new Date(), [Validators.required]),
      natureOfCorrection: new FormControl(''),
      mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
      NearestRegtotheAplcnt: new FormControl('', [Validators.required])
    });
    this.getGnDivisions();
    this.getLandRegistries();
    this.getAllCorrectionsToBeMade();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.reqForCorrectionForm.controls[controlName].hasError(errorName);
  }


  private getGnDivisions(): void {
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

  // saveCorrectionReqDetails(
  //   folioCorrectionReqId: string, landRegistryId: string, deedNo: string, attestedDate: string,
  //   notaryName: string, foliosNum: string, natureOfTheCorrection: string, requestedCorrection: string,
  //   judicialZoneId: number, citizendId: number, newNotaryId: number, workFlowStageCode: string, remark: string,
  //   status: string, lastUpdateTime: string, lastUpdateUser: string, createdTime: string
  // ): void {


  //  }


}
