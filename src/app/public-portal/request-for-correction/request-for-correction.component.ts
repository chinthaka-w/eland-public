import { SessionService } from './../../shared/service/session.service';
import { FileMeta } from './../../shared/dto/file-meta.model';
import { FileUploadPopupComponent } from './../../shared/components/file-upload-popup/file-upload-popup.component';
import { SnackBarService } from './../../shared/service/snack-bar.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CorrectionRequestService } from 'src/app/shared/service/correction-request.service';
import { LandRegistryModel } from 'src/app/shared/dto/land-registry.model.';
import {Workflow} from "../../shared/enum/workflow.enum";
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { CorrectionDetail } from 'src/app/shared/dto/correction-detail.model';
import { FolioCorrectionWorkflowStages } from 'src/app/shared/enum/folio-correction-workflow-stages.enum';
@Component({
  selector: 'app-request-for-correction',
  templateUrl: './request-for-correction.component.html',
  styleUrls: ['./request-for-correction.component.css']
})
export class RequestForCorrectionComponent implements OnInit {

  public reqForCorrectionForm: FormGroup;
  public landRegistry: LandRegistryModel[];
  landRegs: any;
  workflow = Workflow;
  displayedColumns: string[] = ['folioNo', 'dayBookNo', 'correctionNature', 'requestedCorrection', 'action'];
  correctionDetails: CorrectionDetail[] = [];
  dataSource = new MatTableDataSource<CorrectionDetail>(this.correctionDetails);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filesMeta: FileMeta[];

  constructor(private correctionRequestService: CorrectionRequestService,private formBuilder: FormBuilder,
              private snackBarService: SnackBarService,
              public dialog: MatDialog,
              public sessionService: SessionService
              ) { }

  ngOnInit() {
    this.reqForCorrectionForm = this.formBuilder.group({
      landRegId: [, [Validators.required]],
      folioNo: ['', [Validators.required]],
      dayBookNo: [''],
      deedNo: [''],
      notaryName: [''],
      attestedDate: [new Date()],
      correctionNature: [null, [Validators.required]],
      requestedCorrection: [null, [Validators.required]],
      recaptcha: [null],
    });
    this.initPaginator();
    this.getLandRegistries();
  }

  get folioNo() {
    return this.reqForCorrectionForm.get('folioNo');
  }

  get landRegId() {
    return this.reqForCorrectionForm.get('landRegId');
  }

  get correctionNature() {
    return this.reqForCorrectionForm.get('correctionNature');
  }

  get requestedCorrection() {
    return this.reqForCorrectionForm.get('requestedCorrection');
  }

  get recaptcha() {
    return this.reqForCorrectionForm.get('recaptcha');
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.reqForCorrectionForm.controls[controlName].hasError(errorName);
  }

  private getLandRegistries(): void {
    this.correctionRequestService.getLandRegistries().subscribe(res => {
      this.landRegs = res;
    });
  }

  onFormSubmit() {
    if (this.correctionDetails.length > 0) {
      this.recaptcha.setValidators([Validators.required]);
      this.recaptcha.updateValueAndValidity();
      this.updateValidationsOnSubmit();

      if (this.reqForCorrectionForm.invalid) {
        this.snackBarService.warn('Plase fill the form');
      } else if (this.reqForCorrectionForm.valid) {
        this.validateForm();
        console.log('form data value ', this.correctionDetails);
      }
    } else {
      this.snackBarService.warn('Plase fill the form');
    }
  }

  getBase64(value: string): string {
    return btoa(value);
  }

  // add folio correction
  onAddCorrection(): void {
    this.recaptcha.clearValidators();
    this.updateValidationsOnAddFolioCorrection();
    if (this.reqForCorrectionForm.invalid) {
      this.snackBarService.error('Please fill the form');
      this.validateForm();
      return;
    }
    let correctionData = new CorrectionDetail();
    correctionData = this.reqForCorrectionForm.value;
    correctionData.userRoleCode = this.sessionService.getUser().type;
    correctionData.userId = this.sessionService.getUser().id;
    this.correctionDetails.push(correctionData);
    this.updateDatasource(this.correctionDetails);
    this.initPaginator();
    this.resetForm();
  }

  onClearAll(): void {
    if (this.correctionDetails.length > 0) {
      this.correctionDetails = [];
    }
    this.updateDatasource(this.correctionDetails);
    this.initPaginator();
  }

  onClearItem(index: number) {
    if (index != null) {
      this.correctionDetails.splice(index, 1);
      this.updateDatasource(this.correctionDetails);
      this.initPaginator();
    }
  }

  onDocUpload(index: number) {
    const dialogRef = this.dialog.open(FileUploadPopupComponent, {
      width: '750px',
      data: FolioCorrectionWorkflowStages.FOLIO_CORRECTION_REQUEST_INITIATE
    });
    dialogRef.afterClosed().subscribe((filesMeta: FileMeta[]) => {
      this.filesMeta = filesMeta;
      this.correctionDetails[index].filesMeta = filesMeta;
    });
  }

  updateDatasource(correctionDetails: CorrectionDetail[]): void {
    this.dataSource = new MatTableDataSource(correctionDetails);
  }

  initPaginator(): void {
    this.dataSource.paginator = this.paginator;
  }

  resetForm(): void {
    const correctionDetail = new CorrectionDetail();
    correctionDetail.landRegId = this.landRegId.value;
    this.reqForCorrectionForm.reset();
    this.reqForCorrectionForm.patchValue(correctionDetail); 
  }

  // clear validators when submit
  updateValidationsOnSubmit(): void {
    this.landRegId.clearValidators();
    this.landRegId.updateValueAndValidity();

    this.folioNo.clearValidators();
    this.folioNo.updateValueAndValidity();

    this.correctionNature.clearValidators();
    this.correctionNature.updateValueAndValidity();

    this.requestedCorrection.clearValidators();
    this.requestedCorrection.updateValueAndValidity();
  }

  // add validators when add a correction
  updateValidationsOnAddFolioCorrection(): void {
    this.landRegId.setValidators([Validators.required]);
    this.landRegId.updateValueAndValidity();

    this.folioNo.setValidators([Validators.required]);
    this.folioNo.updateValueAndValidity();

    this.correctionNature.setValidators([Validators.required]);
    this.correctionNature.updateValueAndValidity();

    this.requestedCorrection.setValidators([Validators.required]);
    this.requestedCorrection.updateValueAndValidity();
  }

  validateForm(): void {
    Object.keys(this.reqForCorrectionForm.controls).forEach(field => {
        const control = this.reqForCorrectionForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
  }

}
