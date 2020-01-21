import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {JudicialService} from '../../../shared/service/change-judicial-service';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc-dto';
import {Languages} from '../../../shared/enum/languages.enum';
import {JudicialChange} from '../../../shared/dto/judicial-change-model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {DsGnDivisionDTO} from '../../../shared/dto/gs-gn-model';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {DocumentDto} from '../../../shared/dto/document-list';
import {JudicialChangeWorkflowStagesEnum} from '../../../shared/enum/judicial-change-workflow-stages.enum';
import {GnDivisionDTO} from "../../../shared/dto/gn-division.dto";
import {SessionService} from '../../../shared/service/session.service';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PaymentDto} from '../../../shared/dto/payment-dto';

@Component({
  selector: 'app-change-judicial',
  templateUrl: './change-judicial.component.html',
  styleUrls: ['./change-judicial.component.css']
})
export class ChangeJudicialComponent implements OnInit {
  public landRegistry: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];
  public locationList: any[] = [];
  public previousSelections: any[] = [];
  public locationDto: any = {};
  public gsDivisions: DsDivision[];
  public gnDivisions: GnDivisionDTO[];
  public isSelected: boolean;
  judicialChangeForm: FormGroup;
  public docList: WorkflowStageDocDto[];
  public notaryId: number;
  public langArr: number[];
  public isSinhala: boolean;
  public isTamil: boolean;
  public isEnglish: boolean;
  public fromDate: Date;
  public toDate: Date;
  public dsDivisionId: number;
  public dsGnList: DsGnDivisionDTO[] = [];
  public isContinueToPayment: boolean = false;
  Parameters = Parameters;
  WorkflowCode = JudicialChangeWorkflowStagesEnum;
  public paymentId: number;
  public isPaymentSuccess: boolean;
  public files: File[] = [];
  public documentList: DocumentDto[] = [];
  public judicialChange = new JudicialChange;
  isContinue: boolean = false;
  returnURl: string;
  paymentMethod: number;
  paymentDto: PaymentDto = new PaymentDto();
  statusOnlinePayment: boolean;
  public languages: any[] = [
    {
      id: Languages.ENGLISH,
      description: 'English'
    },
    {
      id: Languages.SINHALA,
      description: 'Sinhala'
    },
    {
      id: Languages.TAMIL,
      description: 'Tamil'
    }
  ];


  constructor(
    private judicialService: JudicialService,
    private location: Location,
    private snackBar: SnackBarService,
    private sessionService: SessionService,) {
  }

  ngOnInit() {
    this.judicialChangeForm = new FormGroup({
      addressEng: new FormControl('',),
      addressSin: new FormControl('',),
      addressTam: new FormControl('',),
      notarialWorkStartDate: new FormControl('', ),
      certificateYear: new FormControl('', ),
      nameOfLr: new FormControl('', ),
      isDuplicateHandedOver: new FormControl('', ),
      datePeriod: new FormControl('', ),
      judicialZoneId: new FormControl('', ),
      landRegistry: new FormControl('', ),
    });
    this.isSinhala = false;
    this.isTamil = false;
    this.isEnglish = false;
    this.notaryId = this.sessionService.getUser().id;
    this.getLandRegistries();
    this.getJudicialZone();
    this.getDsDivision();
    this.getDocumentList();
    this.locationList.push(this.locationDto);
    this.getLanguages();
    this.isPaymentSuccess = false;
    this.isContinueToPayment = false;


  }

  private getDsDivision(): void {
    this.judicialService.getDsDivision().subscribe(
      (data: DsDivision[]) => {
        this.gsDivisions = data;
      }
    );
  }

  private getGnDivision(dsDivId: number): void {
    this.judicialService.getGnDivision(dsDivId).subscribe(
      (data: GnDivisionDTO[]) => {
        this.gnDivisions = data;
      }
    );
  }

  private getLandRegistries(): void {
    this.judicialService.getAllLandRegistries().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  private getJudicialZone(): void {
    this.judicialService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZone = data;
      }
    );
  }

  private getDocumentList(): void {
    this.judicialService.getDocuments(JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  private getLanguages(): void {
    this.judicialService.getLanguages(this.notaryId).subscribe(
      (data: number[]) => {
        this.langArr = data;
        for (const langId of this.langArr) {
          if (langId === Languages.ENGLISH) {
            this.isEnglish = true;
          }
          if (langId === Languages.SINHALA) {
            this.isSinhala = true;
          }
          if (langId === Languages.TAMIL) {
            this.isTamil = true;
          }
        }
      }
    );
  }

  addLocation() {
    this.locationList.push(this.locationDto);
    this.previousSelections.push(-1);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.gsDivisions.forEach(gsDivision => {
      if (gsDivision.dsDivisionId === this.locationList[index].gsDivision) {
        this.isSelected = false;
      }
    });
    this.locationList.splice(index, 1);
    this.previousSelections.splice(index, 1);
  }

  selectGsDivision(gsDivisionId, index) {
    this.dsDivisionId = gsDivisionId;
    this.getGnDivision(gsDivisionId);
    this.gsDivisions.forEach(gsDivision => {
      if (gsDivision.dsDivisionId === gsDivisionId) {
        this.isSelected = true;
      }
      if (gsDivision.dsDivisionId === this.previousSelections[index]) {
        this.isSelected = false;
      }
    });
    this.previousSelections[index] = gsDivisionId;
  }


  selectGnDivision(gsDivisionId) {
    this.dsGnList.push(new DsGnDivisionDTO(this.dsDivisionId, gsDivisionId[0]));
  }
  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }

  submitForm() {
    this.judicialChange.judicialZoneId = this.judicialChangeForm.value.judicialZoneId;
    this.judicialChange.addressEng = this.judicialChangeForm.value.addressEng;
    this.judicialChange.addressSin = this.judicialChangeForm.value.addressSin;
    this.judicialChange.addressTam = this.judicialChangeForm.value.addressTam;
    this.judicialChange.notarialWorkStartDate = this.judicialChangeForm.value.notarialWorkStartDate;
    this.judicialChange.certificateYear = this.judicialChangeForm.value.certificateYear;
    this.judicialChange.nameOfLr = this.judicialChangeForm.value.nameOfLr;
    this.judicialChange.isDuplicateHandedOver = this.judicialChangeForm.value.isDuplicateHandedOver;
    this.judicialChange.landRegistry = this.judicialChangeForm.value.landRegistry;
    this.judicialChange.fromDate = this.fromDate;
    this.judicialChange.toDate = this.toDate;
    this.judicialChange.newNotaryId = this.notaryId;
    this.judicialChange.dsGnList = this.dsGnList;
    this.judicialChange.paymentId = this.paymentId;

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.judicialChange));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.judicialService.save(formData).subscribe((result) => {
      if (result && this.paymentMethod !== PaymentMethod.ONLINE) {
        this.snackBar.success('Judicial Change Request Success');
      } else if (this.paymentMethod === PaymentMethod.ONLINE) {
        this.snackBar.success('Judicial Change Request Success, Proceed to online payment');
        this.isContinue = true;
        this.statusOnlinePayment = true;
      } else {
        this.snackBar.error('Operation failed');
      }
    });
  }

  saveDate(event: any) {
    this.fromDate = event.target.value.begin;
    this.toDate = event.target.value.end;
  }

  get FormControls() {
    return this.judicialChangeForm.controls;
  }

  onClickSubmitSearchRequest() {
    this.isContinueToPayment = !this.isContinueToPayment;
  }

  onPaymentResponse(data: PaymentResponse) {
    if (this.paymentMethod !== PaymentMethod.ONLINE) {
      alert(data.paymentId+'pay id');
      this.paymentDto.paymentId = data.paymentId;
      this.judicialChange.payment = this.paymentDto;
      this.submitForm();
    }
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    // save citizen form for online payment with reference no
    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.judicialChange.payment = this.paymentDto;
      this.submitForm();
    }

  }

  onBack(data: boolean) {
    this.isContinue = !data;
  }

  goBack(): any {
    this.location.back();
    return false;
  }

  continue(): void {
    this.isContinue = true;
  }
}
