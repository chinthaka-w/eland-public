import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {Location} from '@angular/common';
import {Workflow} from '../../../../../shared/enum/workflow.enum';

@Component({
  selector: 'app-extract-application',
  templateUrl: './extract-application.component.html',
  styleUrls: ['./extract-application.component.css']
})
export class ExtractApplicationComponent implements OnInit, OnChanges {

  @Input() workflow: string;
  @Input() requestId: number;
  @Input() action: string;

  SearchRequestType = SearchRequestType;
  Parameters = Parameters;
  WorkflowCode = Workflow;
  ActionMode = ActionMode;

  public isContinueToPayment: boolean = false;

  public searchRequestForm: FormGroup;
  public folioForm: FormGroup;

  public landRegistries: LandRegistryModel[] = [];
  public paththuwas: Paththuwa[] = [];
  public korales: Korale[] = [];
  public dsDivisions: DsDivision[] = [];
  public gnDivisions: GnDivision[] = [];
  public villages: Village[] = [];
  public searchReasons: SearchReason[] = [];

  public searchRequest = new SearchRequest();

  //Mat Table Config
  public elements: Element[] = [];
  public displayedColumns: string[] = ['Folio No', 'No. of years', 'Status', 'Action'];
  public dataSource = new MatTableDataSource<any>(this.elements);

  constructor(
    private landRegistryService: LandRegistryService,
    private paththuwaService: PaththuwaService,
    private koraleService: KoraleService,
    private dsDivisionService: DsDivisionService,
    private gnDivisionService: GnDivisionService,
    private villageService: VillageService,
    private searchReasonService: SearchReasonService,
    private folioNoService: FolioNoService,
    private searchRequestService: SearchRequestService,
    private sessionService: SessionService,
    private snackBarService: SnackBarService,
    private location: Location) {
  }

  ngOnInit() {

    this.searchRequestForm = new FormGroup({
      'landRegistryId': new FormControl('', Validators.required),
      'requestType': new FormControl(SearchRequestType.FOLIO_DOCUMENT, Validators.required),
      'attestedByNotaryName': new FormControl(''),
      'practicedLocation': new FormControl(''),
      'numberOfTheDeed': new FormControl(''),
      'natureOfTheDeed': new FormControl(''),
      'probablePeriodFrom': new FormControl(''),
      'probablePeriodTo': new FormControl(''),
      'nameOfTheGranter': new FormControl(''),
      'nameOfTheGrantee': new FormControl(''),
      'nameOfTheLand': new FormControl('', Validators.required),
      'extent': new FormControl('', Validators.required),
      'paththuId': new FormControl('', Validators.required),
      'koraleId': new FormControl('', Validators.required),
      'dsDivisionId': new FormControl('', Validators.required),
      'gnDivisionId': new FormControl('', Validators.required),
      'villageId': new FormControl('', Validators.required),
      'searchReasonId': new FormControl('', Validators.required),
    });

    this.folioForm = new FormGroup({
      'folioNo': new FormControl('', Validators.required),
      'noOfYears': new FormControl('', Validators.required),
    });

    if (this.action === ActionMode.VIEW) {
      this.searchRequestForm.disable();
      this.folioForm.disable();
    }

    this.loadLandRegistries();
    this.loadKorale();
    this.loadDSDivision();
    this.loadReasonForSearch();

    this.searchRequestForm.get('koraleId').valueChanges.subscribe(value => {
      this.loadPaththu(value);
    });

    this.searchRequestForm.get('dsDivisionId').valueChanges.subscribe(value => {
      this.loadGNDivision(value);
    });

    this.searchRequestForm.get('gnDivisionId').valueChanges.subscribe(value => {
      this.loadVillage(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workflow'] || changes['requestId']) {
      this.loadSearchRequest();
    }
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

  saveRequest(searchRequest: SearchRequest): void {
    this.searchRequestService.saveSearchRequest(searchRequest).subscribe(
      (data) => {
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.snackBarService.error(error.message);
      }, () => {
        this.resetForm();
        this.isContinueToPayment = false;
        this.snackBarService.success('Your Search request is submitted.')
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

  onChangeRequestType() {
    // this.resetForm();
    if (this.requestType == SearchRequestType.FOLIO_DOCUMENT) {
      this.searchRequestForm.get('attestedByNotaryName').clearValidators();
      this.searchRequestForm.get('practicedLocation').clearValidators();
      this.searchRequestForm.get('numberOfTheDeed').clearValidators();
      this.searchRequestForm.get('natureOfTheDeed').clearValidators();
      this.searchRequestForm.get('probablePeriodFrom').clearValidators();
      this.searchRequestForm.get('probablePeriodTo').clearValidators();
      this.searchRequestForm.get('nameOfTheGranter').clearValidators();
      this.searchRequestForm.get('nameOfTheGrantee').clearValidators();
    } else if (this.requestType == SearchRequestType.DEED_DOCUMENT) {
      this.searchRequestForm.get('attestedByNotaryName').setValidators(Validators.required);
      this.searchRequestForm.get('practicedLocation').setValidators(Validators.required);
      this.searchRequestForm.get('numberOfTheDeed').setValidators(Validators.required);
      this.searchRequestForm.get('natureOfTheDeed').setValidators(Validators.required);
      this.searchRequestForm.get('probablePeriodFrom').setValidators(Validators.required);
      this.searchRequestForm.get('probablePeriodTo').setValidators(Validators.required);
      this.searchRequestForm.get('nameOfTheGranter').setValidators(Validators.required);
      this.searchRequestForm.get('nameOfTheGrantee').setValidators(Validators.required);
    }
  }

  onChangeKorale(koraleId: any) {
    this.loadPaththu(koraleId);
  }

  onChangeDsDivision(dsDivisionId: any) {
    this.loadGNDivision(dsDivisionId);
  }

  onChangeGnDivision(gnDivisionId: any) {
    this.loadVillage(gnDivisionId);
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
      errorMassage = 'Folio No or No.of Years can not be empty';
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
            index: this.elements.length,
            folioNo: this.folioForm.get('folioNo').value,
            noOfYears: this.folioForm.get('noOfYears').value,
            status: folioStatus.desc
          };
          this.elements.push(element);
          this.dataSource.data = this.elements;
          this.folioForm.reset();
        }
      );
    } else {
      this.snackBarService.error(errorMassage)
    }
  }

  onClickDelete(index: any) {
    this.elements.splice(index, 1);
    this.dataSource.data = this.elements;
  }

  onClickSubmitSearchRequest() {

    let isValid = true;
    let errorMassage = '';

    if (!this.searchRequestForm.valid) {
      isValid = false;
      errorMassage = 'Please fill application form, before continue.';
    }

    if (this.requestType == SearchRequestType.FOLIO_DOCUMENT && this.searchRequestForm.valid && this.elements.length == 0) {
      isValid = false;
      errorMassage = 'Please add one or more folio, before continue.';
    }

    if (isValid) {
      this.searchRequest = this.searchRequestForm.value;
      this.searchRequest.folioList = this.elements;
      this.searchRequest.workflowStageCode = WorkflowStages.SEARCH_REQ_INITIALIZED;
      this.searchRequest.userId = this.sessionService.getUser().id;
      this.searchRequest.userType = this.sessionService.getUser().type;
      this.isContinueToPayment = !this.isContinueToPayment;
    } else {
      this.snackBarService.error(errorMassage);
    }


  }

  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentStatusCode != PaymentStatus.PAYMENT_FAILED) {
      this.searchRequest.paymentId = data.paymentId;
      this.saveRequest(this.searchRequest);
    } else {
      this.snackBarService.error('Oh no, Your payment failed.')
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
    });
    this.folioForm.reset({
      'folioNo': '',
      'noOfYears': '',
    });
    this.elements = [];
    this.dataSource.data = this.elements;
  }

  loadSearchRequest(): void {
    this.searchRequestService.findById(this.requestId).subscribe(
      (data: any) => {
        this.searchRequestForm.patchValue(data);
        this.elements = data.folioList;
        this.dataSource.data = this.elements;
      }
    );
  }

}

export interface Element {
  index: number;
  folioNo: string;
  noOfYears: string;
  status: string;
}