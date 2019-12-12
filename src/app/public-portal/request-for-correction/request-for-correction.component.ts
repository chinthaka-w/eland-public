import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CorrectionRequestService } from 'src/app/shared/service/correction-request.service';
import { LandRegistryModel } from 'src/app/shared/dto/land-registry.model.';
import { JudicialZoneModel } from 'src/app/shared/dto/judicial-zone.model';
import { correctionReq } from 'src/app/shared/dto/correctionReq.model';

@Component({
  selector: 'app-request-for-correction',
  templateUrl: './request-for-correction.component.html',
  styleUrls: ['./request-for-correction.component.css']
})
export class RequestForCorrectionComponent implements OnInit {

  public reqForCorrectionForm: FormGroup;
  public correctioReq: JudicialZoneModel[];
  public landReg: LandRegistryModel[];
  public correctionReqDetails: correctionReq;
  submitted = false;
  selected: any[];
  uploadSuccess: boolean;


  judicialzone: any;
  landRegs: any;

  constructor(private correctionRequestService: CorrectionRequestService, ) { }

  ngOnInit() {
    this.reqForCorrectionForm = new FormGroup({
      // folioCorrectionReqId:new FormControl(),
      requestedCorrection: new FormControl('', [Validators.required]),
      notaryName: new FormControl('', [Validators.required]),
      landRegId:new FormControl('', [Validators.required]),
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
    this.correctionRequestService.saveCorrectionReq(this.reqForCorrectionForm.value)
      .subscribe( res => {
        console.log("result ",res);
      });
  }



}
