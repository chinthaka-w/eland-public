import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {FolioStatus} from '../../../shared/dto/folio-status.model';
import {Enum} from '../../../shared/dto/enum.model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';


@Component({
  selector: 'app-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.css']
})
export class SearchDocumentComponent implements OnInit {

  SearchRequestType = SearchRequestType;

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
    private snackBarService: SnackBarService,
    private changeDetectorRefs: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.searchRequestForm = new FormGroup({
      'landRegistryId': new FormControl(''),
      'requestType': new FormControl(SearchRequestType.FOLIO_DOCUMENT),
      'attestedByNotaryName': new FormControl(),
      'practicedLocation': new FormControl(),
      'numberOfTheDeed': new FormControl(),
      'natureOfTheDeed': new FormControl(),
      'probablePeriodFrom': new FormControl(),
      'probablePeriodTo': new FormControl(),
      'nameOfTheGranter': new FormControl(),
      'nameOfTheGrantee': new FormControl(),
      'nameOfTheLand': new FormControl(),
      'extent': new FormControl(),
      'paththu': new FormControl(''),
      'korale': new FormControl(''),
      'dsDivision': new FormControl(''),
      'gnDivision': new FormControl(''),
      'village': new FormControl(''),
      'reasonForSearch': new FormControl(''),
    });

    this.folioForm = new FormGroup({
      'folioNo': new FormControl('', Validators.required),
      'noOfYears': new FormControl('', Validators.required),
    });
    this.loadLandRegistries();
    this.loadKorale();
    this.loadDSDivision();
    this.loadReasonForSearch();

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


//Local changes

  get requestType() {
    return this.searchRequestForm.get('requestType').value;
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
    this.isContinueToPayment = !this.isContinueToPayment;
  }


  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentMethod == PaymentMethod.FRONT_COUNTER) {
      this.isContinueToPayment = false;
      this.searchRequestForm.disable();
      this.folioForm.disable();
    }
  }
}

export interface Element {
  index: number;
  folioNo: string;
  noOfYears: string;
  status: string;
}

