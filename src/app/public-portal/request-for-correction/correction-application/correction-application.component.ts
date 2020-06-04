import { transition } from '@angular/animations';
import { SystemService } from './../../../shared/service/system.service';
import { FileUploadPopupComponent } from './../../../shared/components/file-upload-popup/file-upload-popup.component';
import { FileMeta } from './../../../shared/dto/file-meta.model';
import { SessionService } from 'src/app/shared/service/session.service';
import { RequestResponse } from './../../../shared/dto/request-response.model';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CorrectionRequestService } from 'src/app/shared/service/correction-request.service';
import { LandRegistryModel } from 'src/app/shared/dto/land-registry.model.';
import {MatTableDataSource, MatDialog, MatPaginator, MatSnackBar} from '@angular/material';
import { CorrectionDetail } from 'src/app/shared/dto/correction-detail.model';
import { FolioCorrectionWorkflowStages } from 'src/app/shared/enum/folio-correction-workflow-stages.enum';
import { CorrectionRequest } from 'src/app/shared/dto/correction-request.model';
import { Workflow } from 'src/app/shared/enum/workflow.enum';
import { CommonStatus } from 'src/app/shared/enum/common-status.enum';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';

@Component({
  selector: 'app-correction-application',
  templateUrl: './correction-application.component.html',
  styleUrls: ['./correction-application.component.css']
})
export class CorrectionApplicationComponent implements OnInit {

  @Input() isReadonly = false;
  @Input() newRequest = false;
  @Input() showLastRemark = false;
  public reqForCorrectionForm: FormGroup;
  public landRegistry: LandRegistryModel[];
  landRegs: any;
  workflow = Workflow;
  displayedColumns: string[] = ['folioNo', 'dayBookNo', 'correctionNature', 'requestedCorrection', 'action'];
  correctionDetails: CorrectionDetail[] = [];
  dataSource = new MatTableDataSource<CorrectionDetail>(this.correctionDetails);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filesMeta: FileMeta[];
  maxDate = new Date();
  editIndex: number;
  isEdit = false;
  isSave = false;
  isClick = false;
  reqId: number;
  isLrLoaded = false;

  constructor(private correctionRequestService: CorrectionRequestService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService,
              public dialog: MatDialog,
              public sessionService: SessionService,
              public router: Router,
              public route: ActivatedRoute,
              private systemService: SystemService,
              private systemMethodService: SystemService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.reqId = +this.decodeUrl(params.get('id'));
       }
    });
    this.loadCorrectionForm();
  }

  get folioNo() {
    return this.reqForCorrectionForm.get('folioNo');
  }

  get landRegId() {
    return this.reqForCorrectionForm.get('landRegId');
  }

  get dayBookNo() {
    return this.reqForCorrectionForm.get('dayBookNo');
  }

  get deedNo() {
    return this.reqForCorrectionForm.get('deedNo');
  }

  get notaryName() {
    return this.reqForCorrectionForm.get('notaryName');
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
    },
    () => {
      this.snackBarService.error(this.systemService.getTranslation('ALERT.WARNING.INTERNAL_SERVER_ERROR'));
    },
    () => {
      this.isLrLoaded = true;
      if (this.reqId != null) {
        this.getCorrectionRequest();
      }
    });
  }

  loadCorrectionForm() {
    this.reqForCorrectionForm = this.formBuilder.group({
      landRegId: ['', [Validators.required]],
      folioNo: ['', [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.FOLIO_NUMBER)
      ]],
      dayBookNo: ['', [
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.DAY_BOOK_NUMBER)
      ]],
      deedNo: ['', [
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)
      ]],
      notaryName: ['', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)
      ]],
      attestedDate: [new Date(), [
      ]],
      correctionNature: [null, [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)
      ]
      ],
      requestedCorrection: [null, [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)
      ]],
      recaptcha: [null],
    });
    this.initPaginator();
    this.getLandRegistries();
  }

  onFormSubmit() {
    this.isClick = true;
    this.isSave = true;

    // submit new correction request
    if (this.newRequest) {
      if (this.correctionDetails.length > 0) {
        this.recaptcha.setValidators([Validators.required]);
        this.recaptcha.updateValueAndValidity();
        this.updateValidationsOnSubmit();
        if (this.reqForCorrectionForm.invalid) {
          if (this.reqForCorrectionForm.value.recaptcha == null) {
            this.snackBarService.error(this.systemService.getTranslation('ALERT.TITLE.VALIDATE_CAPTURE'));
            this.isSave = false;
          } else {
            this.snackBarService.warn(this.systemService.getTranslation('ALERT.TITLE.PLEASE_FILL'));
            this.isSave = false;
          }

        } else if (this.reqForCorrectionForm.valid) {
          // check mandatory documents
          if (!this.checkMandatoryDocsStatus(this.correctionDetails)) {
            this.snackBarService.warn(this.systemService.getTranslation('ALERT.TITLE.MANDATORY_DOC_ERR'));
            this.isClick = false;
            this.isSave = false;
            return;
          }
          // submit correction request
          const correctionRequest = new CorrectionRequest();
          correctionRequest.correctionDetails = this.correctionDetails;
          correctionRequest.userId = this.sessionService.getUser().id;
          correctionRequest.userType = this.sessionService.getUser().type;
          correctionRequest.workflowStageCode = FolioCorrectionWorkflowStages.APPLICANT_INITIATE;

          this.correctionRequestService.saveCorrectionReq(correctionRequest).subscribe(
            (response: RequestResponse) => {
              if (response.status === CommonStatus.SUCCESS) {
                this.isSave = false;
                this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
                this.router.navigate(['/requests', this.getBase64(Workflow.FOLIO_REQUEST_CORRECTION)]);
              }
            }
          );
        }
      } else {
        this.snackBarService.warn(this.systemService.getTranslation('ALERT.TITLE.PLEASE_FILL'));
        this.isClick = false;
        this.isSave = false;
      }

      // submit request update
    } else if (!this.newRequest) {
      this.recaptcha.setValidators([Validators.required]);
      this.recaptcha.updateValueAndValidity();
      if (this.reqForCorrectionForm.valid) {
        let updatedCorrectionDetail = new CorrectionDetail();
        updatedCorrectionDetail = this.reqForCorrectionForm.value;
        this.correctionDetails = [];
        this.correctionDetails.push(updatedCorrectionDetail);

        const updatedCorrectionRequest = new CorrectionRequest();
        updatedCorrectionRequest.correctionDetails = this.correctionDetails;
        updatedCorrectionRequest.userId = this.sessionService.getUser().id;
        updatedCorrectionRequest.userType = this.sessionService.getUser().type;
        updatedCorrectionRequest.id = this.reqId;

        this.correctionRequestService.saveCorrectionReq(updatedCorrectionRequest).subscribe(
          (response: RequestResponse) => {
            if (response.status === CommonStatus.SUCCESS) {
              this.isSave = false;
              this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.UPDATE_SUCCESS'));
            }
          }
        );
      } else {
        if (this.reqForCorrectionForm.value.recaptcha == null) {
          this.snackBarService.error(this.systemService.getTranslation('ALERT.TITLE.VALIDATE_CAPTURE'));
          this.isSave = false;
        } else {
          this.snackBarService.warn(this.systemService.getTranslation('ALERT.TITLE.PLEASE_FILL'));
          this.isSave = false;
        }
      }
    } else {
      this.snackBarService.warn(this.systemService.getTranslation('ALERT.TITLE.PLEASE_FILL'));
      this.isSave = false;
    }
  }

  getBase64(value: string): string {
    return btoa(value);
  }

  decodeUrl(url: string): string {
    return atob(url);
  }

  // add folio correction
  onAddCorrection(editIndex: number): void {
    this.recaptcha.clearValidators();
    // this.updateValidationsOnAddFolioCorrection();
    if (this.reqForCorrectionForm.invalid) {
      this.snackBarService.error(this.systemService.getTranslation('ALERT.TITLE.PLEASE_FILL'));
      return;
    }

    let correctionData = new CorrectionDetail();
    correctionData = this.reqForCorrectionForm.value;
    if (!this.isEdit) {
      this.correctionDetails.push(correctionData);
    } else if (this.isEdit && editIndex != null) {
      this.isEdit = false;
      // set edit form and previous upload documents
      this.filesMeta = this.correctionDetails[editIndex].filesMeta;
      this.correctionDetails[editIndex] = this.reqForCorrectionForm.value;
      this.correctionDetails[editIndex].filesMeta = this.filesMeta;
    }
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

  onEdit(index: number) {
    if (index != null) {
      this.isEdit = true;
      this.editIndex = index;
      this.reqForCorrectionForm.patchValue(this.correctionDetails[index]);
    }
  }

  onDocUpload(index: number) {
    const dialogRef = this.dialog.open(FileUploadPopupComponent, {
      width: '750px',
      data: FolioCorrectionWorkflowStages.APPLICANT_INITIATE
    });
    dialogRef.afterClosed().subscribe((filesMeta: FileMeta[]) => {
      this.filesMeta = filesMeta;
      console.log('file meta', filesMeta);
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

    this.folioNo.setValidators(
      [Validators.required,
        Validators.pattern(PatternValidation.FOLIO_NUMBER)
      ]);
    this.folioNo.updateValueAndValidity();

    this.correctionNature.setValidators([Validators.required
    ]);
    this.correctionNature.updateValueAndValidity();

    this.requestedCorrection.setValidators([Validators.required]);
    this.requestedCorrection.updateValueAndValidity();
  }

  // get request details
  getCorrectionRequest(): void {
    this.correctionRequestService.getCorrectionRequest(this.reqId).subscribe(
      (response: RequestResponse) => {
        const correctionViewRequest: CorrectionRequest = response.data;
        this.reqForCorrectionForm.patchValue(correctionViewRequest.correctionDetails[0]);
        if  (this.isReadonly) {
          this.reqForCorrectionForm.disable();
          this.isReadonly = true;
        }
      }
    );
  }

  validateForm(): void {
    Object.keys(this.reqForCorrectionForm.controls).forEach(field => {
        const control = this.reqForCorrectionForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
  }

  checkMandatoryDocsStatus(correctionDetails: CorrectionDetail[]): boolean {
    for (const detail of correctionDetails) {
      if (!detail.filesMeta) {
        return false;
      }
    }
    return true;
  }

}
