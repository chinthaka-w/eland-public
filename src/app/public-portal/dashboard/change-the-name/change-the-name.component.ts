import { Workflow } from './../../../shared/enum/workflow.enum';
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
import {CommonStatus} from '../../../shared/enum/common-status.enum';
import {SystemService} from '../../../shared/service/system.service';
import { JudicialService } from 'src/app/shared/service/change-judicial-service';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';
import {TempData} from '../../../shared/dto/temp-data.model';
import {RequestData} from '../../../shared/dto/request-data.model';
import {AuthorizeRequestService} from '../../../shared/service/authorize-request.service';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';

@Component({
  selector: 'app-change-the-name',
  templateUrl: './change-the-name.component.html',
  styleUrls: ['./change-the-name.component.css']
})
export class ChangeTheNameComponent implements OnInit {
  @Input()
  files: File[] = [];

  public docList: WorkflowStageDocDto[]=[];
  public langList: number[] = [];
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
  NameChangeWorkflowStagesEnum = NameChangeWorkflowStagesEnum;
  Workflow = Workflow;
  public nameChangeModel = new NotaryNameChangeModel();
  public searchDetails: RequestSearchDetailDTO;
  result: NewNotaryViewDto;
  searchType: NewNotaryRequestsCategorySearchDto ;
  public notaryDetails: Notary;
  paymentId: number;
  newNotaryId: number;
  userName: string;
  newNotaryRegistrationRequestId: number;
  notaryTitle = '';
  judicialZoneId: number;
  public date: Date;
  public requestID: number;
  public type: string;
  public data: any;
  public hasRemarks = false;
  public notaryType: string;

  public isSinhala = false;
  public isTamil = false;
  public isEnglish = true;

  public notaryId: number;
  public isPaymentSuccess: boolean;
  public isContinueToPayment = false;
  public requestId: number;
  public paymentDataValue: PaymentDto;
  paymentDto: PaymentDto = new PaymentDto();

  nameTitles: NameTitleDTO[] = [];

  paymentMethod: number;
  returnURl: string;
  statusOnlinePayment: boolean;
  isPayment = false;
  userType: string;
  userId: number;
  isRequiredDocsUpload = false;
  firstValue: any;
  lastValue: any;
  appliedCertificates: number[] = [];
  isEnglishCertificate = false;
  isSinhalaCertificate = false;
  isTamilCertificate = false;

  public isDataChanged: boolean = false;

  get FormControls() {
    return this.notaryForm.controls;
  }

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
              private router: Router,
              private sysMethodsService: SysMethodsService,
              private authorizeRequestService: AuthorizeRequestService,
              private tokenStorageService: TokenStorageService,
              private systemService: SystemService,
              private judicialService: JudicialService
              ) { }

  ngOnInit() {
    this.notaryId = this.sessionService.getUser().id;
    this.userType = this.sessionService.getUser().type;
    this.setData();
  }

  setData() {
    this.getAppliedCertificateDetails();
    this.getUserDetails();
    this.notaryForm = this.formBuilder.group({
      title: new FormControl(null, [Validators.required]),
      newFullNameInEnglish: new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator , Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]),
      newFullNameInSinhala: new FormControl('', [Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]),
      newFullNameInTamil: new FormControl('', [Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]),
      newInitialNameInEnglish: new FormControl('',  [Validators.required,this.sysMethodsService.noWhitespaceValidator , Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]),
      newInitialNameInSinhala: new FormControl('', [Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]),
      newInitialNameInTamil: new FormControl('', [Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]),
      dateOfBirth: new FormControl(new Date()),
      languages: new FormControl(),
      // recaptcha: new FormControl(null, [Validators.required]),
    });
    this.getNameTitles();
    // this.getJudicialZones();
    // this.getLandRegistries();
    // this.getDsDivisions();
    // this.getGnDivisions();
    // this.getTempData();
    this.isPaymentSuccess = false;
    this.isContinueToPayment = false;

    this.notaryForm.valueChanges.subscribe(x => {
      this.lastValue = x;
    });
  }

  getTempData() {

    let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_NAME_CHANGE_KEY);
    if (tempDataId) {
      this.authorizeRequestService.getTempDataById(tempDataId).subscribe(
        (tempData:TempData) => {
          if(tempData){
            let requestData:RequestData = JSON.parse(tempData.tempData);

            this.notaryForm.patchValue(JSON.parse(requestData.formData));
            if (requestData.documentData)
              this.documentList = JSON.parse(requestData.documentData);
          }
        },(error)=>{},
        ()=>{
          this.getDocumentList();
        });
    }else{
      this.getDocumentList();
    }
  }

  comparevaluesOfform(): boolean {

    if (this.firstValue.title === this.lastValue.title
      && this.firstValue.newFullNameInEnglish === this.lastValue.newFullNameInEnglish
      && this.firstValue.newFullNameInSinhala === this.lastValue.newFullNameInSinhala
      && this.firstValue.newFullNameInTamil === this.lastValue.newFullNameInTamil
      && this.firstValue.newInitialNameInEnglish === this.lastValue.newInitialNameInEnglish
      && this.firstValue.newInitialNameInSinhala === this.lastValue.newInitialNameInSinhala
      && this.firstValue.newInitialNameInTamil === this.lastValue.newInitialNameInTamil
       ) {
      return false;

    } else {
      return true;
    }

  }

  public addLanguageList(id: number): void {
    if (id === Languages.SINHALA) {
      this.isSinhala = (!this.isSinhala);
    }
    if (id === Languages.TAMIL) {
      this.isTamil = (!this.isTamil);
    }

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

  getAppliedCertificateDetails(): void {
    this.judicialService.getLanguages(this.notaryId).subscribe(
      (result: any[]) => {
        this.appliedCertificates = result;
        this.appliedCertificates.forEach((certificate, index) => {
          if (certificate === Languages.ENGLISH) {
            this.isEnglishCertificate = true;
          }
          if (certificate === Languages.SINHALA) {
            this.isSinhalaCertificate = true;
            this.notaryForm.get('newFullNameInSinhala').setValidators(
              [Validators.required,this.sysMethodsService.noWhitespaceValidator , Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]);
            this.notaryForm.get('newFullNameInSinhala').updateValueAndValidity();
            this.notaryForm.get('newInitialNameInSinhala').setValidators(
              [Validators.required,this.sysMethodsService.noWhitespaceValidator , Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]);
            this.notaryForm.get('newInitialNameInSinhala').updateValueAndValidity();
          }
          if (certificate === Languages.TAMIL) {
            this.isTamilCertificate = true;
            this.notaryForm.get('newFullNameInTamil').setValidators(
              [Validators.required,this.sysMethodsService.noWhitespaceValidator , Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]);
            this.notaryForm.get('newFullNameInTamil').updateValueAndValidity();
            this.notaryForm.get('newInitialNameInTamil').setValidators(
              [Validators.required,this.sysMethodsService.noWhitespaceValidator , Validators.pattern(PatternValidation.nameValidation),Validators.maxLength(255)]);
            this.notaryForm.get('newInitialNameInTamil').updateValueAndValidity();
          }
        });
      }
    );
  }

  getUserDetails() {
    this.notaryService.getNotaryRequestDetails(this.notaryId).subscribe(
      (data: RequestSearchDetailDTO) => {
        this.searchDetails = data;
        this.requestId = this.searchDetails.requestId;
        this.getApplicationDetails();
      }
    );
  }

  getApplicationDetails() {
    this.searchType = new NewNotaryRequestsCategorySearchDto(this.requestId, this.searchDetails.workflow);
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
        this.firstValue = this.notaryForm.value;

        this.judicialZoneId = this.result.judicialZoneId;
        this.notaryTitle = this.result.nametitle.english;
        this.newNotaryId = this.result.newNotaryId;
        this.newNotaryRegistrationRequestId = this.result.newNotaryRegistrationRequestId;
        this.notaryType = this.result.notaryType;
      },
      error1 => {
      },()=>{
        let formVal = this.notaryForm.value;
        this.notaryForm.valueChanges.subscribe(
          (value) => {

            this.isDataChanged = (JSON.stringify(value) !== JSON.stringify(formVal));

          }
        );
        this.getTempData();
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

    if (this.paymentMethod !== PaymentMethod.ONLINE) {

      this.nameChangeService.save(this.documentList,this.nameChangeModel).subscribe(
        (success: string) => {
          if (this.paymentMethod !== PaymentMethod.ONLINE) {
            this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.NAME_CHG_SUCCESS'));
            let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_NAME_CHANGE_KEY);
            if (tempDataId) {
              this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
              this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_NAME_CHANGE_KEY);
            }
            this.router.navigate(['/notary-requests', btoa(Workflow.NOTARY_NAME_CHANGE)]);
          }
          else {
            this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.OPERATION_FAILED'));
          }
        },
        error => {
          this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.FAILED'));
        }
      );
    } else if (this.paymentMethod === PaymentMethod.ONLINE) {

      let requestData = new RequestData();
      requestData.formData = JSON.stringify(this.notaryForm.value);
      requestData.documentData = JSON.stringify(this.documentList);
      requestData.paymentData = JSON.stringify(this.paymentDataValue);
      requestData.otherData1 = JSON.stringify(this.nameChangeModel);

      let tempData = new TempData();
      tempData.tempData = JSON.stringify(requestData);
      tempData.status = CommonStatus.ACTIVE;

      this.authorizeRequestService.saveTempData(tempData).subscribe(
        (tempData: TempData) => {
          this.tokenStorageService.saveFormData(this.tokenStorageService.NEW_NOTARY_NAME_CHANGE_KEY, tempData.tempDataId);
          this.isPayment = true;
          this.statusOnlinePayment = true;
        }
      );
    }
  }

  private getDocumentList(): void {
    this.documetService.getDocuments(NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      },
      (error) => {
      },
      () => {
        if (this.documentList.length > 0) {
          for (let document of this.documentList) {
            for (let doc of this.docList) {
              if (document.fileType == doc.docTypeId) {
                doc.file = this.sysMethodsService.getFileFromDocumentDTO(document);
                document.files = doc.file;
                break;
              }
            }
          }
          this.checkDocumentValidation();
        }
      });
  }

  public getJudicialZones(): void {
    this.judicialZoneService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZones = data;
      }
    );
  }

  public getLandRegistries(): void {
    this.landRegistryService.getAllLandRegistry().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  public getGnDivisions(): void {
    this.gnDivisionService.getAllGnDivisions().subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data ;
      }
    );
  }

  public getDsDivisions(): void {
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

  setFiles(data: any, doc: any) {
    doc.selected = true;
    this.files = data;
    let document = this.isDocumentAvailable(doc.docTypeId);
    if (document) {
      let index = this.documentList.findIndex((data: DocumentDto) => {
        return data == document
      });
      if (data.length != 0) {
        this.documentList[index].files = this.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        let this2 = this;
        this2.documentList[index].fileName = this.files[0].name;
        this2.documentList[index].fileFormats = this.files[0].type;
        reader.onload = function () {
          this2.documentList[index].fileBase64 = reader.result;
        };
      } else {
        this.documentList.splice(index, 1);
      }
    } else {

      let newDoc = new DocumentDto(this.files[0], doc.docTypeId);
      newDoc.fileName = this.files[0].name;
      newDoc.fileFormats = this.files[0].type;

      let reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      reader.onload = function () {
        newDoc.fileBase64 = reader.result;
      };

      this.documentList.push(newDoc);
    }
    this.checkDocumentValidation();
  }

  checkDocumentValidation() {
    let invalid = false;
    this.docList.forEach((item: WorkflowStageDocDto) => {
      if (item.required && !this.isDocumentAvailable(item.docTypeId)) {
        item.invalid = true;
        invalid = true;
      } else {
        item.invalid = false;
      }
    });
    return invalid;
  }

  isDocumentAvailable(docTypeId: any): any {
    return this.documentList.find((data: DocumentDto) => {
        return data.fileType == docTypeId;
      }
    );
  }

  onClickSubmitSearchRequest() {
    // if (this.isDataChanged) {
      if (this.notaryForm.valid) {
        this.isContinueToPayment = !this.isContinueToPayment;
      }
    // } else {
    //   this.snackBar.warn('No Changes Found!');
    // }
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
      this.returnURl = 'notary-requests/' + btoa(Workflow.NOTARY_NAME_CHANGE);
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
