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
import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/service/session.service';
import {LanguageChange} from '../../../shared/dto/language-change.model';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {SystemService} from '../../../shared/service/system.service';
import {DocumentDto} from '../../../shared/dto/document-list';
import {CommonStatus} from '../../../shared/enum/common-status.enum';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';


@Component({
  selector: 'app-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.css']
})
export class LanguageChangeComponent implements OnInit {
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
  workflowStage = LanguageChangeWorkflowStages;
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
              private systemService: SystemService) {
  }

  ngOnInit() {
    this.backUrl = btoa(Workflow.LANGUAGE_CHANGE);
    this.getSupportingDocs(LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT);
    this.getNameTitles();
    this.loadForm();
    this.userType = this.sessionService.getUser().type;
    this.userId = this.sessionService.getUser().id;
  }

  /**
   * Load language change application form
   */
  private loadForm(): void {
    this.languageChangForm = this.formBulder.group({
      title: new FormControl(0, null),
      langEng: new FormControl('', null),
      langSin: new FormControl('', null),
      langTam: new FormControl('', null),
      fullNameEng: new FormControl({value:'',disabled:true},
        [Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      fullNameSin: new FormControl('', null),
      fullNameTam: new FormControl('', null),
      nameWithInitEng: new FormControl({value:'',disabled:true},
        [Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      nameWithInitSin: new FormControl('', null),
      nameWithInitTam: new FormControl('', null),
      addPermanentEng: new FormControl({value:'',disabled:true}, null),
      addPermanentSin: new FormControl('', null),
      addPermanentTam: new FormControl('', null),
      addressEng: new FormControl({value:'',disabled:true}, null),
      addressSin: new FormControl('', null),
      addressTam: new FormControl('', null),
      startingDate: new FormControl('', null),
      highCourtCertificateYear: new FormControl('', null),
      lrName: new FormControl('', null),
      returnAttestedStatus: new FormControl('', null),
      unavailableTimePeriod: new FormControl('', null),
      date: new FormControl('', null),
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

        // this.languageChangForm.get('nameWithInitEng').disable();
        // this.languageChangForm.get('fullNameEng').disable();
        // this.languageChangForm.get('addPermanentEng').disable();
        // this.languageChangForm.get('addressEng').disable();

        if(result.fullNameSin != null) {
          this.languageChangForm.get('fullNameSin').disable();
        }

        if(result.fullNameTam != null) {
          this.languageChangForm.get('fullNameTam').disable();
        }


        if(result.nameWithInitSin != null) {
          this.languageChangForm.get('nameWithInitSin').disable();
        }

        if(result.nameWithInitTam != null) {
          this.languageChangForm.get('nameWithInitTam').disable();
        }

        if(result.addressSin != null) this.currentAddressSinhala.disable();

        if(result.addressTam!= null) this.currentAddressTamil.disable();

        if(result.addPermanentSin!= null) this.permanentAddressSinhala.disable();

        if(result.addPermanentTam!= null) this.permanentAddressTamil.disable();

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
      }
    );
  }

/**
 * Applicant language change request only applicable for one at a time
 * Only one value can be select
 */
 languageChange(code: number): void {

  if (code === Languages.TAMIL) {
    this.langTamCheck = this.languageChangForm.value.langTam;
    if (!this.langSinRegistered) {
      this.langSinCheck = false;
      this.languageChangForm.value.langSin = false;
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

  if (code === Languages.SINHALA) {
    this.langSinCheck = this.languageChangForm.value.langSin;
    if (!this.langTamRegistered) {
      this.langTamCheck = false;
      this.languageChangForm.value.langTam = false;
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


  // setFiles(data: any, docTyprId: number, status: boolean) {
  //   this.files = data;
  //   const document = new DocumentDto(this.files[0], docTyprId);
  //   document.status = status ? CommonStatus.REQUIRED : CommonStatus.OPTIONAL;
  //   if (document.files) {
  //     this.documentList.push(document);
  //   } else {
  //     this.documentList.forEach((doc, index) => {
  //       if (doc.fileType === document.fileType) {
  //         this.documentList.splice(index, 1);
  //       }
  //     });
  //   }
  //
  //   let workflowManatoryDocs = 0;
  //   let uploadedMandatoryDocs = 0;
  //
  //   this.supportingDocs.forEach(doc => {
  //     if  (doc.required) {
  //       workflowManatoryDocs += 1;
  //     }
  //   });
  //
  //   this.documentList.forEach(doc => {
  //     if (doc.status === CommonStatus.REQUIRED) {
  //       uploadedMandatoryDocs += 1;
  //     }
  //   });
  //
  //   if (workflowManatoryDocs === uploadedMandatoryDocs) {
  //     this.isRequiredDocsUpload = true;
  //   } else {this.isRequiredDocsUpload = false; }
  // }

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
      } else {
        this.documentList.splice(index, 1);
      }
    } else {
      this.documentList.push(new DocumentDto(this.files[0], doc.docTypeId));
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
    this.saveRegistrationData(this.files, this.languageChangForm.value, langPayment);
  }

  saveRegistrationData(files: object, model: LanguageChange, paymentData: PaymentDto) {

    this.documentList.forEach(doc => {
      this.formData.append('file', doc.files, doc.fileType + '/' + doc.files.name);
    });


    model.workflowStage = LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT;
    model.id = this.sessionService.getUser().id;
    model.payment = paymentData;
    this.formData.append('model', JSON.stringify(model));
    // save form data
    this.languageChangeService.saveLanguageChange(this.formData).subscribe(
      (result) => {
        if(paymentData.paymentMethod == PaymentMethod.ONLINE){
          this.returnURl = `requests/${btoa(Workflow.LANGUAGE_CHANGE)}`;
          this.statusOnlinePayment = true;
        }
        else{
        this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
        this.router.navigate(['/requests', btoa(Workflow.LANGUAGE_CHANGE)]);
        }
      },
      error => {
        this.snackBarService.error(this.systemService.getTranslation('ALERT.MESSAGE.FAILED'));
        console.log(error);
      }
    );
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.paymentDto.paymentMethod = PaymentMethod.ONLINE;
      this.saveRegistrationData(this.fileList, this.languageChangForm.value, this.paymentDto);
    }

  }

  onBack(data: boolean) {
    this.showPayment = false;
  }

}
