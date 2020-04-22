import { Workflow } from './../../../shared/enum/workflow.enum';
import { Router } from '@angular/router';
import { PaymentResponse } from './../../../shared/dto/payment-response.model';
import { PaymentDto } from './../../../shared/dto/payment-dto';
import { LanguageChangeService } from './../../../shared/service/language-change.service';
import { SnackBarService } from './../../../shared/service/snack-bar.service';
import { Enum } from './../../../shared/dto/enum.model';
import { LanguageChangeWorkflowStages } from './../../../shared/enum/language-change-workflow-stages.enum';
import { Parameters } from './../../../shared/enum/parameters.enum';
import { WorkflowStageDocDto } from './../../../shared/dto/workflow-stage-doc-dto';
import { Languages } from './../../../shared/enum/languages.enum';
import {NameTitleDTO} from './../../../shared/dto/name-title.dto';
import {FormGroup, FormControl, Validators, AbstractControl, FormBuilder} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {SessionService} from '../../../shared/service/session.service';
import {LanguageChange} from '../../../shared/dto/language-change.model';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';


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
  langSinCheck: boolean;
  langEngCheck: boolean;
  langTamCheck: boolean;
  showPayment: boolean;
  supportingDocs: WorkflowStageDocDto[] = [];
  fileList: object = {};
  formData: FormData = new FormData();
  parameters = Parameters;
  workflowStage = LanguageChangeWorkflowStages;
  returnURl: string;
  paymentMethod: number;
  paymentDto: PaymentDto = new PaymentDto();
  statusOnlinePayment: boolean = false;
  userType: string;
  userId: number;

  constructor(private formBulder: FormBuilder,
              private languageChangeService: LanguageChangeService,
              private sessionService: SessionService,
              private snackBarService: SnackBarService,
              private router: Router) {
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
      title: [0, null],
      langEng: [false, null],
      langSin: [false, null],
      langTam: [false, null],
      fullNameEng: ['', null],
      fullNameSin: ['', null],
      fullNameTam: ['', null],
      nameWithInitEng: ['', null],
      nameWithInitSin: ['', null],
      nameWithInitTam: ['', null],
      addPermanentEng: ['', null],
      addPermanentSin: ['', null],
      addPermanentTam: ['', null],
      addressEng: ['', null],
      addressSin: ['', null],
      addressTam: ['', null],
      startingDate: ['', null],
      highCourtCertificateYear: ['', null],
      lrName: ['', null],
      returnAttestedStatus: ['', null],
      unavailableTimePeriod: ['', null],
      date: ['', null]
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

        if (result.langEng) {
          this.languageChangForm.get('langEng').disable();
        }
        if (result.langSin) {
          this.languageChangForm.get('langSin').disable();
        }
        if (result.langTam) {
          this.languageChangForm.get('langTam').disable();
        }
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
          this.snackBarService.error('Plese select a language!');
    } else if (!this.languageChangForm.valid) {
      this.snackBarService.error('Please fill the required fields!');
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

    this.languageChangForm = this.formBulder.group({
      title: [this.languageChangForm.value.title, [Validators.required]],
      langEng: [this.langEngCheck, null],
      langSin: [this.langSinCheck, null],
      langTam: [this.langTamCheck, null],
      fullNameEng: [this.languageChangForm.value.fullNameEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
      fullNameSin: [this.languageChangForm.value.fullNameSin, code === this.langMode.SINHALA ? [Validators.required] : null],
      fullNameTam: [this.languageChangForm.value.fullNameTam, code === this.langMode.TAMIL ? [Validators.required] : null],
      nameWithInitEng: [this.languageChangForm.value.nameWithInitEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
      nameWithInitSin: [this.languageChangForm.value.nameWithInitSin, code === this.langMode.SINHALA ? [Validators.required] : null],
      nameWithInitTam: [this.languageChangForm.value.nameWithInitTam, code === this.langMode.TAMIL ? [Validators.required] : null],
      addPermanentEng: [this.languageChangForm.value.addPermanentEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
      addPermanentSin: [this.languageChangForm.value.addPermanentSin, code === this.langMode.SINHALA ? [Validators.required] : null],
      addPermanentTam: [this.languageChangForm.value.addPermanentTam, code === this.langMode.TAMIL ? [Validators.required] : null],
      addressEng: [this.languageChangForm.value.addressEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
      addressSin: [this.languageChangForm.value.addressSin, code === this.langMode.SINHALA ? [Validators.required] : null],
      addressTam: [this.languageChangForm.value.addressTam, code === this.langMode.TAMIL ? [Validators.required] : null],
      // startingDate: [this.languageChangForm.value.startingDate, [Validators.required]],
      // highCourtCertificateYear: [this.languageChangForm.value.highCourtCertificateYear, [Validators.required]],
      // lrName: [this.languageChangForm.value.lrName, [Validators.required]],
      // returnAttestedStatus: [this.languageChangForm.value.returnAttestedStatus, null],
      // unavailableTimePeriod: [this.languageChangForm.value.unavailableTimePeriod, null],
      // date: [this.languageChangForm.value.date, [Validators.required]]
    });
    // Disable already applied languages

    if (this.languageChangForm.value.langEng) {
      this.languageChangForm.get('langEng').disable();
    }
    if (this.languageChangForm.value.langSin) {
      this.languageChangForm.get('langSin').disable();
    }
    if (this.languageChangForm.value.langTam) {
      this.languageChangForm.get('langTam').disable();
    }

    // Enable checkbox input
    if (code === this.langMode.SINHALA) {
        if (!this.languageChangForm.get('langSin').disabled) {
        this.languageChangForm.patchValue({
          langSin: true
        });
      }
        if (!this.languageChangForm.get('langEng').disabled) {
        this.languageChangForm.patchValue({
          langEng: false
        });
      }
        if (!this.languageChangForm.get('langTam').disabled) {
        this.languageChangForm.patchValue({
          langTam: false
        });
      }

    } else if (code === this.langMode.ENGLISH) {
      if (!this.languageChangForm.get('langSin').disabled) {
        this.languageChangForm.patchValue({
          langSin: false
        });
      }
      if (!this.languageChangForm.get('langEng').disabled) {
        this.languageChangForm.patchValue({
          langEng: true
        });
      }
      if (!this.languageChangForm.get('langTam').disabled) {
        this.languageChangForm.patchValue({
          langTam: false
        });
      }

    } else if (code === this.langMode.TAMIL) {
      if (!this.languageChangForm.get('langSin').disabled) {
        this.languageChangForm.patchValue({
          langSin: false
        });
      }
      if (!this.languageChangForm.get('langEng').disabled) {
        this.languageChangForm.patchValue({
          langEng: false
        });
      }
      if (!this.languageChangForm.get('langTam').disabled) {
        this.languageChangForm.patchValue({
          langTam: true
        });
      }
    }
  }

  setFiles(data: any, docTypeId: number) {
    this.fileList[docTypeId] = data;
  }

  // Save language change request after payment
  getPaymentData(paymentData: PaymentResponse): void {

    const langPayment: PaymentDto = new PaymentDto();
    langPayment.paymentId = paymentData.paymentId;
    this.saveRegistrationData(this.fileList, this.languageChangForm.value, langPayment);
  }

  saveRegistrationData(fileList: object, model: LanguageChange, paymentData: PaymentDto) {
    // add files to FormData
    const keys = Object.keys(fileList);
    for (const index in keys) {
      for (const file of fileList[keys[index]]) {
        this.formData.append('file', file, (keys[index] + '/' + file.name));
      }
    }

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
        this.snackBarService.success('Request submitted successfully!');
        }
      },
      error => {
        this.snackBarService.error('Error in Save!');
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
