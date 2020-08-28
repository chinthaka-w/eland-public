import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SearchRequest} from '../../../../../shared/dto/search-request.model';
import {Village} from '../../../../../shared/dto/village.model';
import {PaththuwaService} from '../../../../../shared/service/paththuwa.service';
import {SearchReasonService} from '../../../../../shared/service/search-reason.service';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PaymentResponse} from '../../../../../shared/dto/payment-response.model';
import {Parameters} from '../../../../../shared/enum/parameters.enum';
import {Paththuwa} from '../../../../../shared/dto/paththuwa.model';
import {Korale} from '../../../../../shared/dto/korale.model';
import {WorkflowStages} from '../../../../../shared/enum/workflow-stages.enum';
import {ActionMode} from '../../../../../shared/enum/action-mode.enum';
import {GnDivisionService} from '../../../../../shared/service/gn-division.service';
import {LandRegistryService} from '../../../../../shared/service/land-registry.service';
import {DsDivision} from '../../../../../shared/dto/ds-division.model';
import {SearchReason} from '../../../../../shared/dto/search-reason.model';
import {PaymentStatus} from '../../../../../shared/enum/payment-status.enum';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {SearchRequestService} from '../../../../../shared/service/search-request.service';
import {GnDivision} from '../../../../../shared/dto/gn-division.model';
import {Enum} from '../../../../../shared/dto/enum.model';
import {LandRegistryModel} from '../../../../../shared/dto/land-registry.model';
import {HttpErrorResponse} from '@angular/common/http';
import {VillageService} from '../../../../../shared/service/village.service';
import {SessionService} from '../../../../../shared/service/session.service';
import {FolioNoService} from '../../../../../shared/service/folio-no.service';
import {SearchRequestType} from '../../../../../shared/enum/search-request-type.enum';
import {KoraleService} from '../../../../../shared/service/korale.service';
import {DsDivisionService} from '../../../../../shared/service/ds-division.service';
import {DatePipe, Location} from '@angular/common';
import {Workflow} from '../../../../../shared/enum/workflow.enum';
import {ExtractRequestService} from '../../../../../shared/service/extract-request.service';
import {FolioStatus} from '../../../../../shared/enum/folio-status.enum';
import {LandRegistryDivisionService} from '../../../../../shared/service/land-registry-division.service';
import {LandRegistryDivision} from '../../../../../shared/dto/land-registry-division.model';
import * as moment from 'moment';
import {PatternValidation} from '../../../../../shared/enum/pattern-validation.enum';
import * as _ from 'lodash';
import {SysMethodsService} from '../../../../../shared/service/sys-methods.service';

@Component({
  selector: 'app-extract-application',
  templateUrl: './extract-application.component.html',
  styleUrls: ['./extract-application.component.css']
})
export class ExtractApplicationComponent implements OnInit, OnChanges {

  @Input() workflow: string;
  @Input() requestId: number;
  @Input() action: string;
  @Output() folioItem = new EventEmitter<Element>();
  @Output() formData = new EventEmitter<FormGroup>();

  SearchRequestType = SearchRequestType;
  Parameters = Parameters;
  WorkflowCode = Workflow;
  ActionMode = ActionMode;
  FolioStatus = FolioStatus;

  public isContinueToPayment: boolean = false;
  public canApply: boolean = false;

  public searchRequestForm: FormGroup;
  public folioForm: FormGroup;

  public landRegistries: LandRegistryModel[] = [];
  public paththuwas: Paththuwa[] = [];
  public korales: Korale[] = [];
  public dsDivisions: DsDivision[] = [];
  public gnDivisions: GnDivision[] = [];
  public villages: Village[] = [];
  public searchReasons: SearchReason[] = [];
  public lrDivisions: LandRegistryDivision[] = [];

  public searchRequest = new SearchRequest();

  previousData: any;

  folioStatus: Enum = null;

  maxDate = moment(new Date()).format('YYYY-MM-DD');
  minDate;

  //Mat Table Config
  public elements: Element[] = [];
  public displayedColumns: string[] = ['Folio No', 'Status', 'Action'];
  public dataSource = new MatTableDataSource<any>(this.elements);

  constructor(
    private landRegistryService: LandRegistryService,
    private paththuwaService: PaththuwaService,
    private lrDivisionService: LandRegistryDivisionService,
    private koraleService: KoraleService,
    private dsDivisionService: DsDivisionService,
    private gnDivisionService: GnDivisionService,
    private villageService: VillageService,
    private searchReasonService: SearchReasonService,
    private folioNoService: FolioNoService,
    private extractRequestService: ExtractRequestService,
    private sessionService: SessionService,
    private snackBarService: SnackBarService,
    private sysMethodsService: SysMethodsService,
    private datePipe: DatePipe,
    private location: Location) {
  }

  ngOnInit() {

    this.searchRequestForm = new FormGroup({
      'landRegistryId': new FormControl('', Validators.required),
      'requestType': new FormControl(SearchRequestType.FOLIO_DOCUMENT, Validators.required),
      'attestedByNotaryName': new FormControl(''),
      'practicedLocation': new FormControl('', [
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.maxLength(255)]),
      'numberOfTheDeed': new FormControl('', [Validators.maxLength(25)]),
      'natureOfTheDeed': new FormControl('', [
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.maxLength(255)]),
      'probablePeriodFrom': new FormControl(''),
      'probablePeriodTo': new FormControl(''),
      'nameOfTheGranter': new FormControl('', [
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.maxLength(255)]),
      'nameOfTheGrantee': new FormControl('', [
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.maxLength(255)]),
      'nameOfTheLand': new FormControl('', [
        Validators.pattern(PatternValidation.CHARACTES_PATTERN)]),
      'extent': new FormControl('', [
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      'paththuId': new FormControl(''),
      'koraleId': new FormControl(''),
      'dsDivisionId': new FormControl(''),
      'gnDivisionId': new FormControl(''),
      'villageId': new FormControl(''),
      'searchReasonId': new FormControl('', [
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255)]),
      'lrDivisionId': new FormControl('', Validators.required),
      'volume': new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(8),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]),
      'folioNo': new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(8),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]),
      'noOfYears': new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(8),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]),
    });

    if (this.action === ActionMode.VIEW) {
      this.searchRequestForm.disable();
    }

    this.loadLandRegistries();
    this.loadKorale();
    this.loadDSDivision();
    this.loadReasonForSearch();

    this.setDisable();

    this.searchRequestForm.get('koraleId').valueChanges.subscribe(value => {
      if(value) this.loadPaththu(value);
    });

    this.searchRequestForm.get('dsDivisionId').valueChanges.subscribe(value => {
      if(value) this.loadGNDivision(value);
    });

    this.searchRequestForm.get('gnDivisionId').valueChanges.subscribe(value => {
      if(value) this.loadVillage(value);
    });

    this.searchRequestForm.get('landRegistryId').valueChanges.subscribe(value => {
      if(value) this.loadLRDivision(value);
    });

    this.searchRequestForm.get('requestType').valueChanges.subscribe(value => {
      if(value) this.onChangeRequestType();
    });

    this.searchRequestForm.valueChanges.subscribe(
      (data) => {
        this.formData.emit(data);
         if(this.previousData) this.canApply = !_.isEqual(JSON.stringify(this.previousData),JSON.stringify(data));
      }
    );

    this.form.get('probablePeriodFrom').valueChanges.subscribe(
      value => {
        if (value) this.minDate = moment(value).format('YYYY-MM-DD');
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workflow'] || changes['requestId']) {
      this.loadSearchRequest();
    }
  }

  // Api call

  setDisable() {
    this.searchRequestForm.get('requestType').disable();
    this.searchRequestForm.get('landRegistryId').disable();
    this.searchRequestForm.get('lrDivisionId').disable();
    this.searchRequestForm.get('volume').disable();
    this.searchRequestForm.get('folioNo').disable();
    this.searchRequestForm.get('noOfYears').disable();
  }

  loadLandRegistries(): void {
    this.landRegistryService.getAllLandRegistry().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistries = data;
      }
    );
  }

  loadPaththu(koraleId: number): void {
    this.paththuwaService.findAllByKoraleId(koraleId).subscribe(
      (data: Paththuwa[]) => {
        this.paththuwas = data;
      }
    );
  }

  loadKorale(): void {
    this.koraleService.findAll().subscribe(
      (data: Korale[]) => {
        this.korales = data;
      }
    );
  }

  loadDSDivision(): void {
    this.dsDivisionService.findAll().subscribe(
      (data: DsDivision[]) => {
        this.dsDivisions = data;
      }
    );
  }

  loadGNDivision(dsDivisionId: number): void {
    this.gnDivisionService.findAllByDsDivisionId(dsDivisionId).subscribe(
      (data: GnDivision[]) => {
        this.gnDivisions = data;
      }
    );
  }

  loadVillage(gnDivisionId: number): void {
    this.villageService.findAllByGnDivision(gnDivisionId).subscribe(
      (data: Village[]) => {
        this.villages = data;
      }
    );
  }

  loadReasonForSearch(): void {
    this.searchReasonService.findAll().subscribe(
      (data: SearchReason[]) => {
        this.searchReasons = data;
      }
    );
  }

  loadLRDivision(id: any): void {
    this.lrDivisionService.getAllByLandRegistryId(id).subscribe(
      (data: LandRegistryDivision[]) => {
        this.lrDivisions = data;
      }
    );
  }

//Local changes

  goBack(): any {
    this.location.back();
    return false;
  }

  get requestType() {
    return this.searchRequestForm.get('requestType').value;
  }

  get form(): FormGroup {
    return this.searchRequestForm as FormGroup;
  }

  onChangeRequestType() {
    this.searchRequestForm.patchValue({
      'attestedByNotaryName': '',
      'practicedLocation': '',
      'numberOfTheDeed': '',
      'natureOfTheDeed': '',
      'probablePeriodFrom': '',
      'probablePeriodTo': '',
      'nameOfTheGranter': '',
      'nameOfTheGrantee': '',
      'nameOfTheLand': '',
      'extent': '',
      'paththuId': '',
      'koraleId': '',
      'dsDivisionId': '',
      'gnDivisionId': '',
      'villageId': '',
      'searchReasonId': '',
      'lrDivisionId': '',
      'volume': '',
      'folioNo': '',
      'noOfYears': '',
    });

    if (this.requestType == SearchRequestType.FOLIO_DOCUMENT) {
      this.searchRequestForm.get('attestedByNotaryName').clearValidators();
      this.searchRequestForm.get('attestedByNotaryName').updateValueAndValidity();
      this.searchRequestForm.get('numberOfTheDeed').clearValidators();
      this.searchRequestForm.get('numberOfTheDeed').updateValueAndValidity();
      this.searchRequestForm.get('lrDivisionId').setValidators(Validators.required);
      this.searchRequestForm.get('lrDivisionId').updateValueAndValidity();
      this.searchRequestForm.get('volume').setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(8),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]);
      this.searchRequestForm.get('volume').updateValueAndValidity();
      this.searchRequestForm.get('folioNo').setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(8),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]);
      this.searchRequestForm.get('folioNo').updateValueAndValidity();
      this.searchRequestForm.get('noOfYears').setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(8),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]);
      this.searchRequestForm.get('noOfYears').updateValueAndValidity();
      this.searchRequestForm.get('searchReasonId').setValidators([
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255)]);
      this.searchRequestForm.get('searchReasonId').updateValueAndValidity();
    } else if (this.requestType == SearchRequestType.DEED_DOCUMENT) {
      this.searchRequestForm.get('attestedByNotaryName').setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.PERSON_NAME_PATTERN),
        Validators.maxLength(255)]);
      this.searchRequestForm.get('attestedByNotaryName').updateValueAndValidity();
      this.searchRequestForm.get('numberOfTheDeed').setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_PATTERN),
        Validators.maxLength(25)]);
      this.searchRequestForm.get('numberOfTheDeed').updateValueAndValidity();
      this.searchRequestForm.get('lrDivisionId').clearValidators();
      this.searchRequestForm.get('lrDivisionId').updateValueAndValidity();
      this.searchRequestForm.get('volume').clearValidators();
      this.searchRequestForm.get('volume').updateValueAndValidity();
      this.searchRequestForm.get('folioNo').clearValidators();
      this.searchRequestForm.get('folioNo').updateValueAndValidity();
      this.searchRequestForm.get('noOfYears').clearValidators();
      this.searchRequestForm.get('noOfYears').updateValueAndValidity();
      this.searchRequestForm.get('searchReasonId').clearValidators();
      this.searchRequestForm.get('searchReasonId').updateValueAndValidity();
      this.searchRequestForm.get('searchReasonId').setValidators([Validators.required]);
      this.searchRequestForm.get('searchReasonId').updateValueAndValidity();
    }
  }

  onClickAddButton() {

    let isValid = true;
    let errorMassage = '';

    if (!this.searchRequestForm.valid) {
      isValid = false;
      errorMassage = 'Please fill application form, before search folio status.';
    }

    if (this.searchRequestForm.valid && !this.folioForm.valid) {
      isValid = false;
      errorMassage = 'Folio No can not be empty';
    }
    //
    // if (isValid && this.folioForm.get('noOfYears').value != null && this.folioForm.get('noOfYears').value != '') {
    //   isValid = false;
    //   errorMassage = 'No. of Years can not be empty';
    // }


    if (isValid) {
      let folioStatus: Enum = null;
      this.folioNoService.findByFolioNo(btoa(this.folioForm.get('folioNo').value)).subscribe(
        (data: Enum) => {
          folioStatus = data;
        }, (error: HttpErrorResponse) => {
          this.snackBarService.error(error.message);
        }, () => {
          let element: Element = {
            index: 0,
            folioNo: this.folioForm.get('folioNo').value,
            statusDes: folioStatus.desc,
            status: folioStatus.code,
            deleted: false,
          };
          this.elements.push(element);
          this.folioItem.emit(element);
          this.dataSource.data = this.elements;
          this.folioForm.reset();
        }
      );
    } else {
      this.snackBarService.error(errorMassage)
    }
  }

  onClickDelete(index: any) {
    this.elements[index].deleted = true;
    this.folioItem.emit(this.elements[index]);
    this.elements.splice(index, 1);
    this.dataSource.data = this.elements;
  }

  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentStatusCode != PaymentStatus.PAYMENT_FAILED) {
      this.searchRequest.paymentId = data.paymentId;
      // this.saveRequest(this.searchRequest);
    } else {
      this.snackBarService.error('Oh no, Your payment failed.')
    }
  }

  loadSearchRequest(): void {
    this.extractRequestService.findById(this.requestId).subscribe(
      (data: any) => {
        this.searchRequestForm.patchValue(data);
        let enumData = new Enum();

        enumData.code = data.folioNoStatus;
        enumData.desc = data.folioNoStatusDes;

        this.folioStatus = enumData;
        this.previousData = this.form.value;
      }
    );
  }

  onClickSaveChanges() {
    let isValid = true;
    let errorMassage = '';

    if (!this.searchRequestForm.valid) {
      isValid = false;
      errorMassage = 'Please fill application form, before apply Changes.';
    }

    // if (isValid && this.elements.length == 0) {
    //   isValid = false;
    //   errorMassage = 'Please add one or more folio, before continue.';
    // }

    if (isValid) {
      // this.searchRequestForm.enable();
      this.searchRequest = this.searchRequestForm.value;
      this.searchRequest.requestId = this.requestId;
      // this.searchRequest.workflowStageCode = SearchRequestWorkflowStages.SEARCH_REQ_MODIFIED;
      // this.searchRequest.folioList = this.folioList;
      // this.searchRequest.paymentList = this.paymentList;
      this.searchRequest.probablePeriodFrom = this.datePipe.transform(
        this.form.get('probablePeriodFrom').value,'yyyy-MM-dd');
      this.searchRequest.probablePeriodTo = this.datePipe.transform(
        this.form.get('probablePeriodTo').value,'yyyy-MM-dd');
      this.searchRequest.userId = this.sessionService.getUser().id;
      this.searchRequest.userType = this.sessionService.getUser().type;
      // this.setDisable();
      this.updateRequest(this.searchRequest);
    } else {
      this.snackBarService.error(errorMassage);
      this.validateAllFormFields(this.searchRequestForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  updateRequest(searchRequest: SearchRequest): void {
    this.extractRequestService.updateSearchRequest(searchRequest).subscribe(
      (data) => {
        if (data) {
          this.snackBarService.success('Your Extract request is updated.');
          this.canApply = false;
        } else {
          this.snackBarService.warn('Please try again.')
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.snackBarService.error(error.message);
      }, () => {
      }
    );
  }

}

export interface Element {
  index: number;
  folioNo: string;
  deleted: boolean;
  statusDes: string;
  status: string;
}
