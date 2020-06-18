import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {SearchRequestType} from '../../../shared/enum/search-request-type.enum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LandRegistryService} from '../../../shared/service/land-registry.service';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model';
import {PaththuwaService} from '../../../shared/service/paththuwa.service';
import {Paththuwa} from '../../../shared/dto/paththuwa.model';
import {KoraleService} from '../../../shared/service/korale.service';
import {Korale} from '../../../shared/dto/korale.model';
import {DsDivisionService} from '../../../shared/service/ds-division.service';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {GnDivisionService} from '../../../shared/service/gn-division.service';
import {GnDivision} from '../../../shared/dto/gn-division.model';
import {Village} from '../../../shared/dto/village.model';
import {VillageService} from '../../../shared/service/village.service';
import {SearchReasonService} from '../../../shared/service/search-reason.service';
import {SearchReason} from '../../../shared/dto/search-reason.model';
import {FolioNoService} from '../../../shared/service/folio-no.service';
import {Enum} from '../../../shared/dto/enum.model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {Workflow} from '../../../shared/enum/workflow.enum';
import {SearchRequest} from '../../../shared/dto/search-request.model';
import {PaymentStatus} from '../../../shared/enum/payment-status.enum';
import {SearchRequestService} from '../../../shared/service/search-request.service';
import {WorkflowStages} from '../../../shared/enum/workflow-stages.enum';
import {SessionService} from '../../../shared/service/session.service';
import {FolioStatus} from '../../../shared/enum/folio-status.enum';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PaymentDto} from '../../../shared/dto/payment-dto';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {SearchRequestWorkflowStages} from '../../../shared/enum/search-request-workflow-stages.enum';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {LandRegistryDivisionService} from '../../../shared/service/land-registry-division.service';
import {LandRegistryDivision} from '../../../shared/dto/land-registry-division.model';
import * as moment from 'moment';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';
import {SystemService} from '../../../shared/service/system.service';


@Component({
  selector: 'app-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.css']
})
export class SearchDocumentComponent implements OnInit {

  SearchRequestType = SearchRequestType;
  Parameters = Parameters;
  WorkflowCode = Workflow;
  FolioStatus = FolioStatus;

  public isContinueToPayment: boolean = false;

  public searchRequestForm: FormGroup;


  public landRegistries: LandRegistryModel[] = [];
  public paththuwas: Paththuwa[] = [];
  public korales: Korale[] = [];
  public dsDivisions: DsDivision[] = [];
  public gnDivisions: GnDivision[] = [];
  public villages: Village[] = [];
  public searchReasons: SearchReason[] = [];
  public lrDivisions: LandRegistryDivision[] = [];

  public searchRequest = new SearchRequest();
  public paymentDto: PaymentDto = new PaymentDto();
  public returnURl;
  statusOnlinePayment: boolean;
  userType: string;
  userId: number;

  folioStatus: Enum = null;

  errorSearch: any;

  maxDate = moment(new Date()).format('YYYY-MM-DD');
  minDate;

  constructor(
    private landRegistryService: LandRegistryService,
    private lrDivisionService: LandRegistryDivisionService,
    private paththuwaService: PaththuwaService,
    private koraleService: KoraleService,
    private dsDivisionService: DsDivisionService,
    private gnDivisionService: GnDivisionService,
    private villageService: VillageService,
    private searchReasonService: SearchReasonService,
    private folioNoService: FolioNoService,
    private searchRequestService: SearchRequestService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private sysMethodsService: SysMethodsService,
    public router: Router,
    private snackBarService: SnackBarService,
    private location: Location,
    private systemService: SystemService) {

    let data = this.router.getCurrentNavigation().extras.state;
    if (data) {
      this.returnURl = data.previousUrl;
    }


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
      'searchReasonId': new FormControl('',[
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
          Validators.required,
          Validators.maxLength(255)]),
      'lrDivisionId': new FormControl('', Validators.required),
      'volume': new FormControl('', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]),
      'folioNo': new FormControl('', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]),
      'noOfYears': new FormControl('', [Validators.required,
        Validators.maxLength(10),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]),
    });


    this.loadLandRegistries();
    this.loadKorale();
    this.loadDSDivision();
    this.loadReasonForSearch();
    this.onChangeFolioFormController();

    this.form.get('probablePeriodFrom').valueChanges.subscribe(
      value => {
        if (value) this.minDate = moment(value).format('YYYY-MM-DD');
      }
    );

    // set online payment
    this.userType = this.sessionService.getUser().type;
    this.userId = this.sessionService.getUser().id;

  }

  // Api call

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
    this.form.patchValue({
      lrDivisionId: ''
    });
    this.lrDivisionService.getAllByLandRegistryId(id).subscribe(
      (data: LandRegistryDivision[]) => {
        this.lrDivisions = data;
      }
    );
  }

  saveRequest(searchRequest: SearchRequest): void {
    this.searchRequestService.saveSearchRequest(searchRequest).subscribe(
      (data) => {
      }, (error: HttpErrorResponse) => {
        this.snackBarService.error(error.message);
      }, () => {
        if (this.paymentDto.paymentMethod == PaymentMethod.ONLINE) {
          this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.PROCEED_ONLINE_PAY'));
          this.statusOnlinePayment = true;
        } else {
          this.isContinueToPayment = false;
          this.resetForm();
          this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.PROCEED_ONLINE_PAY'));
        }
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

  get folioNumber(): string {
    return `${this.form.get('landRegistryId').value}/${this.getSelectedLRD().divisionCode}/${this.form.get('volume').value}/${this.form.get('folioNo').value}`;
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
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]);
      this.searchRequestForm.get('volume').updateValueAndValidity();
      this.searchRequestForm.get('folioNo').setValidators([
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]);
      this.searchRequestForm.get('folioNo').updateValueAndValidity();
      this.searchRequestForm.get('noOfYears').setValidators([
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(PatternValidation.ONLY_NUMBERS)]);
      this.searchRequestForm.get('noOfYears').updateValueAndValidity();
      this.searchRequestForm.get('searchReasonId').setValidators([
        Validators.pattern(PatternValidation.CHARACTES_PATTERN),
        Validators.required,
        Validators.maxLength(255)]);
      this.searchRequestForm.get('searchReasonId').updateValueAndValidity();

    } else if (this.requestType == SearchRequestType.DEED_DOCUMENT) {

      this.searchRequestForm.get('attestedByNotaryName').setValidators([
        Validators.required,
        Validators.pattern(PatternValidation.PERSON_NAME_PATTERN),
        Validators.maxLength(255)]);
      this.searchRequestForm.get('attestedByNotaryName').updateValueAndValidity();
      this.searchRequestForm.get('numberOfTheDeed').setValidators([
        Validators.required,
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
      this.searchRequestForm.get('searchReasonId').setValidators([Validators.required]);
      this.searchRequestForm.get('searchReasonId').updateValueAndValidity();
    }
  }

  onChangeLandRegistry(lrId: any) {
    if (lrId) this.loadLRDivision(lrId);
  }

  onChangeKorale(koraleId: any) {
    if (koraleId) this.loadPaththu(koraleId);
  }

  onChangeDsDivision(dsDivisionId: any) {
    if (dsDivisionId) this.loadGNDivision(dsDivisionId);
  }

  onChangeGnDivision(gnDivisionId: any) {
    if (gnDivisionId) this.loadVillage(gnDivisionId);
  }

  onChangeFolioFormController() {
    this.form.get('landRegistryId').valueChanges.subscribe(value => {
      this.folioStatus = null;
    });
    this.form.get('lrDivisionId').valueChanges.subscribe(value => {
      this.folioStatus = null;
    });
    this.form.get('volume').valueChanges.subscribe(value => {
      this.folioStatus = null;
    });
    this.form.get('folioNo').valueChanges.subscribe(value => {
      this.folioStatus = null;
    });
    this.form.valueChanges.subscribe(value => {
        this.errorSearch = undefined;
      }
    );
  }

  getSelectedLRD(): LandRegistryDivision {
    return this.lrDivisions.find((value: LandRegistryDivision) => {
      return value.landRegistryDivisionId == this.form.get('lrDivisionId').value;
    });
  }

  onClickSearch() {

    let isValid = true;
    let errorMassage = '';
    this.folioStatus = null;

    if (this.searchRequestForm.invalid) {
      isValid = false;
      errorMassage = this.systemService.getTranslation('ALERT.MESSAGE.FILL_APP_FORM1');
    }

    if (isValid) {
      this.folioNoService.findByFolioNo(
        btoa(this.folioNumber)
      ).subscribe(
        (data: Enum) => {
          this.folioStatus = data;
        }, (error: HttpErrorResponse) => {
          this.snackBarService.error(error.message);
        }, () => {
        }
      );
    } else {
      // this.snackBarService.error(errorMassage)
      this.errorSearch = errorMassage;
      this.validateAllFormFields(this.searchRequestForm);
    }
  }

  onClickSubmitSearchRequest() {

    let isValid = true;
    let errorMassage = '';

    if (this.searchRequestForm.invalid) {
      isValid = false;
      errorMassage = this.systemService.getTranslation('ALERT.MESSAGE.FILL_APP_FORM12');
    }

    if (this.requestType == SearchRequestType.FOLIO_DOCUMENT && this.searchRequestForm.invalid && !this.folioStatus) {
      isValid = false;
      errorMassage = this.systemService.getTranslation('ALERT.MESSAGE.SEARCH_FOL');
    }

    if (isValid) {
      this.searchRequest = this.searchRequestForm.value;
      this.searchRequest.userId = this.sessionService.getUser().id;
      this.searchRequest.userType = this.sessionService.getUser().type;
      this.searchRequest.folioNoStatus = this.folioStatus ? this.folioStatus.code : null;
      this.isContinueToPayment = !this.isContinueToPayment;
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

  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentStatusCode != PaymentStatus.PAYMENT_FAILED && data.paymentMethod !== PaymentMethod.ONLINE) {

      this.searchRequest.paymentId = data.paymentId;

      this.searchRequest.workflowStageCode =
        data.paymentMethod == PaymentMethod.BANK_TRANSFER_OR_DIPOSIT ?
          SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED_FOR_ARL :
          SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED_FOR_CLARK;
      this.saveRequest(this.searchRequest);
    } else {
      this.snackBarService.error(this.systemService.getTranslation('ALERT.MESSAGE.PAYMENT_FAILED'));
    }
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentDto.paymentMethod = data.paymentMethod;

    // save online payment with reference no
    if (this.paymentDto.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.paymentDto.deliveryType = data.deliveryType;
      this.paymentDto.deliveryAmount = data.deliveryAmount;
      this.searchRequest.payment = this.paymentDto;
      this.searchRequest.workflowStageCode = SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED_FOR_ARL;
      this.saveRequest(this.searchRequest);
    }

  }

  onBack(data: boolean) {
    this.isContinueToPayment = !data;
  }

  resetForm(): void {
    this.searchRequestForm.reset({
      'landRegistryId': '',
      'requestType': SearchRequestType.FOLIO_DOCUMENT,
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
  }
}

