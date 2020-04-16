import {Component, Input, OnInit} from '@angular/core';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc-dto';
import {SupportingDocService} from '../../../shared/service/supporting-doc.service';
import {Languages} from '../../../shared/enum/languages.enum';
import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {JudicialZoneService} from '../../../shared/service/judicial-zone.service';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {LandRegistryService} from '../../../shared/service/land-registry.service';
import {GnDivision} from '../../../shared/dto/gn-division.model';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {GnDivisionService} from '../../../shared/service/gn-division.service';
import {DsDivisionService} from '../../../shared/service/ds-division.service';
import {NewNotaryDsDivisionDTO} from '../../../shared/dto/new-notary-ds-division.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DocumentDto} from '../../../shared/dto/document-list';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {Location} from '@angular/common';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {NameChangeWorkflowStagesEnum} from '../../../shared/enum/name-change-workflow-stages.enum';
import {NotaryNameChangeModel} from '../../../shared/dto/notary-name-change.model';
import {ChangeNameService} from '../../../shared/service/change-name.service';
import {SessionService} from '../../../shared/service/session.service';
import {RequestSearchDetailDTO} from '../../../shared/dto/request-search.dto';
import {NotaryService} from '../../../shared/service/notary-service';
import {NameTitleEnum} from '../../../shared/enum/name-title.enum';
import {NewNotaryRequestsCategorySearchDto} from '../../../shared/dto/new-notary-requests-category-search.dto';
import {NewNotaryViewDto} from '../../../shared/dto/new-notary-view.dto';
import {Notary} from '../../../shared/dto/notary.model';
import {NewNotaryDataVarificationService} from '../../../shared/service/new-notary-data-varification.service';
import {PaymentDto} from '../../../shared/dto/payment-dto';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {Router} from '@angular/router';
import {NameTitleDTO} from '../../../shared/dto/name-title.dto';
import {LanguageChangeService} from '../../../shared/service/language-change.service';

@Component({
  selector: 'app-change-the-name',
  templateUrl: './change-the-name.component.html',
  styleUrls: ['./change-the-name.component.css']
})
export class ChangeTheNameComponent implements OnInit {
  @Input()
  files: File[] = [];

  public docList: WorkflowStageDocDto[];
  public langList: number[]=[];
  nameTitle = NameTitleEnum;
  public judicialZones: JudicialZoneModel[];
  public landRegistry: LandRegistryModel[];
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public locationList: NewNotaryDsDivisionDTO[] = [];
  public locationDto: any = {};
  public notaryForm: FormGroup;
  public documentList: DocumentDto[] = [];
  Parameters = Parameters;
  WorkflowCode = NameChangeWorkflowStagesEnum;
  public nameChangeModel = new NotaryNameChangeModel();
  public searchDetails: RequestSearchDetailDTO;
  result: NewNotaryViewDto;
  searchType: NewNotaryRequestsCategorySearchDto ;
  public notaryDetails: Notary;
  paymentId: number;
  newNotaryId: number;
  userName: string;
  newNotaryRegistrationRequestId: number;
  notaryTitle: string = '';
  judicialZoneId: number;
  public date: Date;
  public requestID: number;
  public type: string;
  public data: any;
  public hasRemarks: boolean = false;
  public notaryType: string;

  public isSinhala: boolean = false;
  public isTamil: boolean = false;
  public isEnglish: boolean = true;

  public notaryId: number;
  public isPaymentSuccess: boolean;
  public isContinueToPayment: boolean = false;
  public requestId: number;
  public paymentDataValue: PaymentDto;
  paymentDto: PaymentDto = new PaymentDto();

  nameTitles: NameTitleDTO[] = [];

  paymentMethod: number;
  returnURl: string;
  statusOnlinePayment: boolean;
  isPayment: boolean = false;


  constructor(private documetService: SupportingDocService,
              private judicialZoneService: JudicialZoneService,
              private landRegistryService: LandRegistryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private formBuilder: FormBuilder,
              private snackBar: SnackBarService,
              private nameChangeService: ChangeNameService,
              private location: Location,
              private sessionService: SessionService,
              private notaryService: NotaryService,
              private languageChangeService: LanguageChangeService,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService,
              private router: Router
              ) { }

  ngOnInit() {
    this.notaryId = this.sessionService.getUser().id;

    this.setData();
  }

  setData(){
    this.getUserDetails();
    this.notaryForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      newFullNameInEnglish: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newFullNameInSinhala: new FormControl('', this.isSinhala? Validators.required : null),
      newFullNameInTamil: new FormControl('', this.isTamil ? Validators.required : null),
      newInitialNameInEnglish: new FormControl('',  [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInSinhala: new FormControl('', this.isSinhala? Validators.required : null),
      newInitialNameInTamil: new FormControl('',this.isTamil ? Validators.required : null ),
      dateOfBirth: new FormControl(new Date()),
      languages: new FormControl(),
      recaptcha: new FormControl(null),
    });
    this.getNameTitles();
    this.getDocumentList();
    this.getJudicialZones();
    this.getLandRegistries();
    this.getDsDivisions();
    this.getGnDivisions();
    this.isPaymentSuccess = false;
    this.isContinueToPayment = false;
  }

  private addLanguageList(id:number): void {
    if(id === Languages.SINHALA)
      this.isSinhala = (!this.isSinhala);
    if(id === Languages.TAMIL)
      this.isTamil = (!this.isTamil);

    this.setData();
  }

  private getNameTitles() {
    this.languageChangeService.getNameTitle().subscribe(
      (result: NameTitleDTO[]) => {
        this.nameTitles = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  getUserDetails(){
    this.notaryService.getNotaryRequestDetails(this.notaryId).subscribe(
      (data: RequestSearchDetailDTO) =>{
        this.searchDetails = data;
        this.requestId = this.searchDetails.requestId;
        this.getApplicationDetails();
      }
    );
  }

  getApplicationDetails() {
    this.searchType = new NewNotaryRequestsCategorySearchDto(this.requestId,this.searchDetails.workflow);
    this.newNotaryDataVarificationService.getNotaryDetails(this.searchType).subscribe(
      (result: NewNotaryViewDto) => {
        this.result = result;
        this.notaryForm.patchValue(
          {
            title: this.result.nametitle.titleId,
            newInitialNameInEnglish: this.result.nameWithInitial.english,
            newInitialNameInSinhala: this.result.nameWithInitial.sinhala,
            newInitialNameInTamil: this.result.nameWithInitial.tamil,
            newFullNameInEnglish: this.result.fullName.english,
            newFullNameInSinhala: this.result.fullName.sinhala,
            newFullNameInTamil: this.result.fullName.tamil,
            nic: this.result.nic,
            email: this.result.email,
            languages: this.result.language,
            enrolledDate: this.result.enrolledDate,
            passedDate: this.result.subjectPassedDate,
            dateOfBirth: this.result.dateOfBirth,
            courtZone: this.result.judicialZone,
            permenentAddressInEnglish: this.result.permanentAddress.english,
            permenentAddressInSinhala: this.result.permanentAddress.sinhala,
            permenentAddressInTamil: this.result.permanentAddress.tamil,
            currentAddressInEnglish: this.result.currantAddress.english,
            currentAddressInSinhala: this.result.currantAddress.sinhala,
            currentAddressInTamil: this.result.currantAddress.tamil,
            mobileNo: this.result.mobile,
            contactNo: this.result.contactNo,
            landRegistry: this.result.landRegistry,
            userName: this.result.lastUpdatedUser,
            medium: this.result.language,
          }
        );
        this.judicialZoneId = this.result.judicialZoneId;
        this.notaryTitle = this.result.nametitle.english;
        this.newNotaryId = this.result.newNotaryId;
        this.newNotaryRegistrationRequestId = this.result.newNotaryRegistrationRequestId;
        this.notaryType = this.result.notaryType;
      },
      error1 => {
      }
    );
  }

  submitForm() {
    this.nameChangeModel.newFullNameEng = this.notaryForm.value.newFullNameInEnglish;
    this.nameChangeModel.newFullNameSin = this.notaryForm.value.newFullNameInSinhala;
    this.nameChangeModel.newFullNameTam = this.notaryForm.value.newFullNameInTamil;
    this.nameChangeModel.newInitialNameEng = this.notaryForm.value.newInitialNameInEnglish;
    this.nameChangeModel.newInitialNameSin = this.notaryForm.value.newInitialNameInSinhala;
    this.nameChangeModel.newInitialNameTam = this.notaryForm.value.newInitialNameInTamil;
    this.nameChangeModel.newNotaryId = this.notaryId;
    this.nameChangeModel.paymentId = this.paymentDataValue.paymentId;
    this.nameChangeModel.payment = this.paymentDataValue;
    this.nameChangeModel.title = this.notaryForm.value.title;

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.nameChangeModel));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.nameChangeService.save(formData).subscribe(
      (success: string) => {
        if (this.paymentMethod !== PaymentMethod.ONLINE) {
          this.snackBar.success('Notary Name Change Request Success');
          this.notaryForm.reset();
          this.router.navigateByUrl('/dashboard');
        } else if (this.paymentMethod === PaymentMethod.ONLINE) {
          this.snackBar.success('Notary Name Change Request Success, Proceed to online payment');
          this.isPayment = true;
          this.statusOnlinePayment = true;
        } else {
          this.snackBar.error('Operation failed');
        }
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  private getDocumentList(): void {
    this.documetService.getDocuments(NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  private getJudicialZones(): void {
    this.judicialZoneService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZones = data;
      }
    );
  }

  private getLandRegistries(): void {
    this.landRegistryService.getAllLandRegistry().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  private getGnDivisions(): void {
    this.gnDivisionService.getAllGnDivisions().subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data ;
      }
    );
  }

  private getDsDivisions(): void {
    this.dsDivisionService.getAllDsDivisions().subscribe(
      (data: DsDivision[]) => {
        this.dsDivision = data;
      }
    );
  }

  public changes($event): void {
    this.gnDivisionService.getAllGnDivisionsByDsDivisionId(this.notaryForm.value.secretariatDivision).subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
      }
    );
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }


  onClickSubmitSearchRequest() {
    console.log(this.notaryForm.valid);
    if(this.notaryForm.valid)
      this.isContinueToPayment = !this.isContinueToPayment;
  }

  public onFormSubmit() {
    this.isContinueToPayment = true;
    this.isPaymentSuccess = false;
  }

  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentStatusCode === 2 || data.paymentId === undefined || data.paymentId === 0) {
      this.snackBar.error('Failed');
    } else if (this.paymentMethod !== PaymentMethod.ONLINE) {
      this.paymentId = data.paymentId;
      this.paymentDto.paymentId = data.paymentId;
      this.paymentDataValue = this.paymentDto;
      this.isContinueToPayment = false;
      this.isPaymentSuccess = true;
      this.submitForm();
    }
  }
  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    // save notary form for online payment with reference no
    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.paymentDataValue = this.paymentDto;
      this.returnURl = 'login';
      this.submitForm();
    }
  }

  onBack(data: boolean) {
    this.isContinueToPayment = !data;
  }

  goBack(): any {
    this.location.back();
    return false;
  }

}
