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

  constructor(private formBulder: FormBuilder,
              private languageChangeService: LanguageChangeService,
              private sessionService: SessionService,
              private snackBarService: SnackBarService,
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
      fullNameEng: new FormControl('', [Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      fullNameSin: new FormControl('', null),
      fullNameTam: new FormControl('', null),
      nameWithInitEng: new FormControl('', [Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)]),
      nameWithInitSin: new FormControl('', null),
      nameWithInitTam: new FormControl('', null),
      addPermanentEng: new FormControl('', null),
      addPermanentSin: new FormControl('', null),
      addPermanentTam: new FormControl('', null),
      addressEng: new FormControl('', null),
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

        if(result.fullNameEng != null) {
          this.languageChangForm.get('fullNameEng').disable();
        }

        if(result.fullNameSin != null) {
          this.languageChangForm.get('fullNameSin').disable();
        }

        if(result.fullNameTam != null) {
          this.languageChangForm.get('fullNameTam').disable();
        }

        if(result.nameWithInitEng != null) {
          this.languageChangForm.get('nameWithInitEng').disable();
        }

        if(result.nameWithInitSin != null) {
          this.languageChangForm.get('nameWithInitSin').disable();
        }

        if(result.nameWithInitTam != null) {
          this.languageChangForm.get('nameWithInitTam').disable();
        }

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
    if (!(this.languageChangForm.value.langEng || this.languageChangForm.value.langSin || this.languageChangForm.value.langTam)) {
          this.snackBarService.error(this.systemService.getTranslation('ALERT.MESSAGE.SELECT_LANGUAGE'));
    } else if (!this.languageChangForm.valid) {
      this.snackBarService.error(this.systemService.getTranslation('ALERT.MESSAGE.REQUIRED_FIELDS'));
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
    }
    if (code === Languages.SINHALA) {
      this.langSinCheck = this.languageChangForm.value.langSin;
      if (!this.langTamRegistered) {
        this.langTamCheck = false;
        this.languageChangForm.value.langTam = false;
      }
    }
  }


  setFiles(data: any, docTyprId: number, status: boolean) {
    this.files = data;
    const document = new DocumentDto(this.files[0], docTyprId);
    document.status = status ? CommonStatus.REQUIRED : CommonStatus.OPTIONAL;
    if (document.files) {
      this.documentList.push(document);
    } else {
      this.documentList.forEach((doc, index) => {
        if (doc.fileType === document.fileType) {
          this.documentList.splice(index, 1);
        }
      });
    }

    let workflowManatoryDocs = 0;
    let uploadedMandatoryDocs = 0;

    this.supportingDocs.forEach(doc => {
      if  (doc.required) {
        workflowManatoryDocs += 1;
      }
    });

    this.documentList.forEach(doc => {
      if (doc.status === CommonStatus.REQUIRED) {
        uploadedMandatoryDocs += 1;
      }
    });

    if (workflowManatoryDocs === uploadedMandatoryDocs) {
      this.isRequiredDocsUpload = true;
    } else {this.isRequiredDocsUpload = false; }
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
