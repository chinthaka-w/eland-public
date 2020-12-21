import {Workflow} from './../../../shared/enum/workflow.enum';
import {Router} from '@angular/router';
import {PaymentResponse} from './../../../shared/dto/payment-response.model';
import {PaymentDto} from './../../../shared/dto/payment-dto';
import {LanguageChangeService} from './../../../shared/service/language-change.service';
import {SnackBarService} from './../../../shared/service/snack-bar.service';
import {LanguageChangeWorkflowStages} from './../../../shared/enum/language-change-workflow-stages.enum';
import {Parameters} from './../../../shared/enum/parameters.enum';
import {WorkflowStageDocDto} from './../../../shared/dto/workflow-stage-doc-dto';
import {Languages} from './../../../shared/enum/languages.enum';
import {NameTitleDTO} from './../../../shared/dto/name-title.dto';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/service/session.service';
import {LanguageChange} from '../../../shared/dto/language-change.model';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {SystemService} from '../../../shared/service/system.service';
import {DocumentDto} from '../../../shared/dto/document-list';
import {CommonStatus} from '../../../shared/enum/common-status.enum';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';
import {TempData} from '../../../shared/dto/temp-data.model';
import {RequestData} from '../../../shared/dto/request-data.model';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {AuthorizeRequestService} from '../../../shared/service/authorize-request.service';
import {log} from 'util';
import {MatCheckboxChange} from '@angular/material';


@Component({
  selector: 'app-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.css']
})
export class LanguageChangeComponent implements OnInit,AfterViewChecked {
  backUrl: string;
  nameTitles: NameTitleDTO[] = [];
  languageChangForm: FormGroup;
  langMode = Languages;
  langSinCheck: boolean = false;
  langSinRegistered: boolean = false;
  langEngCheck: boolean;
  langEngRegistered: boolean = false;
  langTamCheck: boolean = false;
  langTamRegistered: boolean = false;
  showPayment: boolean = false;
  supportingDocs: WorkflowStageDocDto[] = [];
  isRequiredDocsUpload = false;
  fileList: object = {};
  formData: FormData = new FormData();
  parameters = Parameters;
  LanguageChangeWorkflowStages = LanguageChangeWorkflowStages;
  Workflow = Workflow;
  returnURl: string;
  paymentMethod: number;
  paymentDto: PaymentDto = new PaymentDto();
  statusOnlinePayment: boolean = false;
  userType: string;
  public files: File[] = [];
  userId: number;
  public documentList: DocumentDto[] = [];

  errorMsg: any;

  constructor(private formBulder: FormBuilder,
              private languageChangeService: LanguageChangeService,
              private sessionService: SessionService,
              private snackBarService: SnackBarService,
              private sysMethodsService: SysMethodsService,
              private router: Router,
              private authorizeRequestService: AuthorizeRequestService,
              private tokenStorageService: TokenStorageService,
              private cdr: ChangeDetectorRef,
              private systemService: SystemService) {
  }

  ngOnInit() {
    this.backUrl = btoa(Workflow.LANGUAGE_CHANGE);
    this.getNameTitles();
    this.loadForm();

    this.userType = this.sessionService.getUser().type;
    this.userId = this.sessionService.getUser().id;
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }

  getTempData() {

    let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_LANGUAGE_CHANGE_KEY);
    if (tempDataId) {
      this.authorizeRequestService.getTempDataById(tempDataId).subscribe(
        (tempData:TempData) => {
          if(tempData){
            let requestData:RequestData = JSON.parse(tempData.tempData);

            this.languageChangForm.patchValue(JSON.parse(requestData.formData));
            if (requestData.documentData)
              this.documentList = JSON.parse(requestData.documentData);
          }
        },(error)=>{},
        ()=>{
          this.getSupportingDocs(LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT);
        });
    }else{
      this.getSupportingDocs(LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT);
    }
  }

  /**
   * Load language change application form
   */
  private loadForm(): void {
    this.languageChangForm = new FormGroup({
      title: new FormControl(0, null),
      langEng: new FormControl({value:null,disabled:true}),
      langSin: new FormControl('', null),
      langTam: new FormControl('', null),
      fullNameEng: new FormControl({value:'',disabled:true},
        [Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      fullNameSin: new FormControl(null),
      fullNameTam: new FormControl(null),
      nameWithInitEng: new FormControl({value:'',disabled:true},
        [Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      nameWithInitSin: new FormControl(null),
      nameWithInitTam: new FormControl(null),
      addPermanentEng: new FormControl({value:'',disabled:true}, null),
      addPermanentSin: new FormControl(null),
      addPermanentTam: new FormControl(null),
      addressEng: new FormControl({value:'',disabled:true}, null),
      addressSin: new FormControl(null),
      addressTam: new FormControl(null),
      startingDate: new FormControl({value:null,disabled:false}),
      highCourtCertificateYear: new FormControl({value:null,disabled:false}),
      lrName: new FormControl({value:null,disabled:false}),
      returnAttestedStatus: new FormControl({value:null,disabled:false}),
      unavailableTimePeriod: new FormControl({value:null,disabled:false}),
      date: new FormControl({value:null,disabled:false}),
    });
    this.getRegistrationDetails(this.sessionService.getUser().id);
  }

  // getters for FormControls
  get langEngCheckbox() {
    return this.languageChangForm.get('langEng');
  }
  get langSinhalaCheckbox() {
    return this.languageChangForm.get('langSin');
  }
  get langTamilCheckbox() {
    return this.languageChangForm.get('langTam');
  }
  get fullNameEnglish() {
    return this.languageChangForm.get('fullNameEng');
  }
  get fullNameSinhala() {
    return this.languageChangForm.get('fullNameSin');
  }
  get fullNameTamil() {
    return this.languageChangForm.get('fullNameTam');
  }
  get nameWithInitialsEnglish() {
    return this.languageChangForm.get('nameWithInitEng');
  }
  get nameWithInitialsSinhala() {
    return this.languageChangForm.get('nameWithInitSin');
  }
  get nameWithInitialsTamil() {
    return this.languageChangForm.get('nameWithInitTam');
  }
  get permanentAddressEnglish() {
    return this.languageChangForm.get('addPermanentEng');
  }
  get permanentAddressSinhala() {
    return this.languageChangForm.get('addPermanentSin');
  }
  get permanentAddressTamil() {
    return this.languageChangForm.get('addPermanentTam');
  }
  get currentAddressEnglish() {
    return this.languageChangForm.get('addressEng');
  }
  get currentAddressSinhala() {
    return this.languageChangForm.get('addressSin');
  }
  get currentAddressTamil() {
    return this.languageChangForm.get('addressTam');
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

  private getRegistrationDetails(id: number): void {
    this.languageChangeService.getRegistrationDetails(id).subscribe(
      (result: LanguageChange) => {
        this.languageChangForm.patchValue(result);

        if(!result.fullNameSin && result.fullNameSin !== "") {
          this.languageChangForm.get('fullNameSin').disable();
        }

        if(!result.fullNameTam && result.fullNameTam !== "") {
          this.languageChangForm.get('fullNameTam').disable();
        }


        if(!result.nameWithInitSin && result.nameWithInitSin !== "") {
          this.languageChangForm.get('nameWithInitSin').disable();
        }

        if(!result.nameWithInitTam && result.nameWithInitTam !== "") {
          this.languageChangForm.get('nameWithInitTam').disable();
        }

        if(!result.addressSin && result.addressSin !== "") this.currentAddressSinhala.disable();

        if(!result.addressTam && result.addressTam !== "") this.currentAddressTamil.disable();

        if(!result.addPermanentSin && result.addPermanentSin !== "") this.permanentAddressSinhala.disable();

        if(!result.addPermanentTam && result.addPermanentTam !== "") this.permanentAddressTamil.disable();

        if (result.langEng) {
          this.languageChangForm.get('langEng').disable();
        }
        if (result.langSin) {
          this.languageChangForm.get('langSin').disable();
        }
        if (result.langTam) {
          this.languageChangForm.get('langTam').disable();
        }
        this.langEngRegistered = result.langEng;
        this.langSinRegistered = result.langSin;
        this.langTamRegistered = result.langTam;

        this.langEngCheck = result.langEng;
        this.langSinCheck = result.langSin;
        this.langTamCheck = result.langTam;
      },
      error => {
        console.log(error);
      },()=>{
        this.getTempData();
      }
    );
  }

  continue(): void {
    this.errorMsg = undefined;

    if (!(this.languageChangForm.value.langEng || this.languageChangForm.value.langSin || this.languageChangForm.value.langTam)) {
      this.errorMsg = this.systemService.getTranslation('ALERT.MESSAGE.SELECT_LANGUAGE');
      return
    }

    if (this.languageChangForm.invalid || this.checkDocumentValidation()) {
      Object.keys(this.languageChangForm.controls).forEach(field => {
        const control = this.languageChangForm.get(field);
        control.markAsTouched({onlySelf: true});
      });
      this.documentMarkAsTouched();
      this.errorMsg = 'Please fill all mandatory fields!';
    } else {
      this.showPayment = true;
    }
  }

  enableLanguageMode(): void {
    if (!this.languageChangForm.value.langEng) {
      this.languageChangForm.controls.langEng.enable();
    }
    if (!this.languageChangForm.value.langSin) {
      this.languageChangForm.controls.langSin.enable();
    }
    if (!this.languageChangForm.value.langTam) {
      this.languageChangForm.controls.langTam.enable();
    }
  }

  getSupportingDocs(workflwStage: string): void {
    this.languageChangeService.loadSupportingDocs(workflwStage).subscribe(
      (result: WorkflowStageDocDto[]) => {
        this.supportingDocs = result;
      },
      error => {
        console.log(error);
      },()=>{
        if (this.documentList.length > 0) {
          for (let document of this.documentList) {
            for (let doc of this.supportingDocs) {
              if (document.fileType == doc.docTypeId) {
                doc.file = this.sysMethodsService.getFileFromDocumentDTO(document);
                document.files = doc.file;
                break;
              }
            }
          }
          this.checkDocumentValidation();
        }
      }
    );
  }

/**
 * Applicant language change request only applicable for one at a time
 * Only one value can be select
 */
 languageChange(code: number,value: boolean): void {

  if (code === Languages.TAMIL && this.langTamilCheckbox.enabled) {
    this.langTamCheck = value;
    if (this.langSinhalaCheckbox.enabled) {
      this.langSinCheck = false;
      this.langSinhalaCheckbox.patchValue(false);
      this.langSinhalaCheckbox.updateValueAndValidity();
    }
    if (this.langTamCheck) {
      this.fullNameTamil.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)]);
      this.fullNameTamil.updateValueAndValidity();
      this.nameWithInitialsTamil.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)]);
      this.nameWithInitialsTamil.updateValueAndValidity();
      this.currentAddressTamil.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]);
      this.currentAddressTamil.updateValueAndValidity();
      this.permanentAddressTamil.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]);
      this.permanentAddressTamil.updateValueAndValidity();

    } else {

      this.fullNameTamil.clearValidators();
      this.fullNameTamil.updateValueAndValidity();
      this.nameWithInitialsTamil.clearValidators();
      this.nameWithInitialsTamil.updateValueAndValidity();
      this.permanentAddressTamil.clearValidators();
      this.permanentAddressTamil.updateValueAndValidity();
      this.currentAddressTamil.clearValidators();
      this.currentAddressTamil.updateValueAndValidity();

    }

    this.fullNameSinhala.clearValidators();
    this.fullNameSinhala.updateValueAndValidity();
    this.nameWithInitialsSinhala.clearValidators();
    this.nameWithInitialsSinhala.updateValueAndValidity();
    this.permanentAddressSinhala.clearValidators();
    this.permanentAddressSinhala.updateValueAndValidity();
    this.currentAddressSinhala.clearValidators();
    this.currentAddressSinhala.updateValueAndValidity();
  }

  if (code === Languages.SINHALA && this.langSinhalaCheckbox.enabled) {
    this.langSinCheck = value;
    if (this.langTamilCheckbox.enabled) {
      this.langTamCheck = false;
      this.langTamilCheckbox.patchValue(false);
      this.langTamilCheckbox.updateValueAndValidity();
    }

    if (this.langSinCheck) {
      this.fullNameSinhala.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)]);
      this.fullNameSinhala.updateValueAndValidity();
      this.nameWithInitialsSinhala.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)]);
      this.nameWithInitialsSinhala.updateValueAndValidity();
      this.currentAddressSinhala.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]);
      this.currentAddressSinhala.updateValueAndValidity();
      this.permanentAddressSinhala.setValidators([
        Validators.required,
        this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]);
      this.permanentAddressSinhala.updateValueAndValidity();

    } else {

      this.fullNameSinhala.clearValidators();
      this.fullNameSinhala.updateValueAndValidity();
      this.nameWithInitialsSinhala.clearValidators();
      this.nameWithInitialsSinhala.updateValueAndValidity();
      this.permanentAddressSinhala.clearValidators();
      this.permanentAddressSinhala.updateValueAndValidity();
      this.currentAddressSinhala.clearValidators();
      this.currentAddressSinhala.updateValueAndValidity();

    }

    this.fullNameTamil.clearValidators();
    this.fullNameTamil.updateValueAndValidity();
    this.nameWithInitialsTamil.clearValidators();
    this.nameWithInitialsTamil.updateValueAndValidity();
    this.permanentAddressTamil.clearValidators();
    this.permanentAddressTamil.updateValueAndValidity();
    this.currentAddressTamil.clearValidators();
    this.currentAddressTamil.updateValueAndValidity();
  }

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
    this.supportingDocs.forEach((item: WorkflowStageDocDto) => {
      if (item.required && !this.isDocumentAvailable(item.docTypeId)) {
        item.invalid = true;
        invalid = true;
      } else {
        item.invalid = false;
      }
    });
    return invalid;
  }

  documentMarkAsTouched(){
    this.supportingDocs.forEach((item: WorkflowStageDocDto) => {
      if (item.required && !this.isDocumentAvailable(item.docTypeId)) {
        item.selected = true;
        item.error = false;
        item.invalid = true;
      }
    });

  }

  isDocumentAvailable(docTypeId: any): any {
    return this.documentList.find((data: DocumentDto) => {
        return data.fileType == docTypeId;
      }
    );
  }

  // Save language change request after payment
  getPaymentData(paymentData: PaymentResponse): void {

    const langPayment: PaymentDto = new PaymentDto();
    langPayment.paymentId = paymentData.paymentId;
    this.saveRegistrationData(this.languageChangForm.value, langPayment);
  }

  saveRegistrationData( model: LanguageChange, paymentData: PaymentDto) {

    model.workflowStage = LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT;
    model.id = this.sessionService.getUser().id;
    model.payment = paymentData;

    if(paymentData.paymentMethod == PaymentMethod.ONLINE){
      let requestData = new RequestData();
      requestData.formData = JSON.stringify(this.languageChangForm.value);
      requestData.documentData = JSON.stringify(this.documentList);
      requestData.paymentData = JSON.stringify(paymentData);
      requestData.otherData1 = JSON.stringify(model);

      let tempData = new TempData();
      tempData.tempData = JSON.stringify(requestData);
      tempData.status = CommonStatus.ACTIVE;

      this.authorizeRequestService.saveTempData(tempData).subscribe(
        (tempData: TempData) => {
          this.tokenStorageService.saveFormData(this.tokenStorageService.NEW_NOTARY_LANGUAGE_CHANGE_KEY, tempData.tempDataId);
          this.returnURl = `requests/${btoa(Workflow.LANGUAGE_CHANGE)}`;
          this.statusOnlinePayment = true;
        }
      );


    } else {
      // save form data
      this.languageChangeService.saveLanguageChange(this.documentList, model).subscribe(
        (result) => {
          let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_LANGUAGE_CHANGE_KEY);
          if (tempDataId) {
            this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_LANGUAGE_CHANGE_KEY);
          }
          this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
          this.router.navigate(['/requests', btoa(Workflow.LANGUAGE_CHANGE)]);

        },
        error => {
          this.snackBarService.error(this.systemService.getTranslation('ALERT.MESSAGE.FAILED'));
          console.log(error);
        }
      );
    }
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.paymentDto.paymentMethod = PaymentMethod.ONLINE;
      this.saveRegistrationData(this.languageChangForm.value, this.paymentDto);
    }

  }

  onBack(data: boolean) {
    this.showPayment = false;
  }

  languageTamChange(value: MatCheckboxChange) {
    this.languageChange(Languages.TAMIL,value.checked);
  }

  languageSinChange(value: MatCheckboxChange) {
    this.languageChange(Languages.SINHALA,value.checked);
  }
}
