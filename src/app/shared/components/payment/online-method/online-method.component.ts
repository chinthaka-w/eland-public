import {WorkflowStages} from './../../../enum/workflow-stages.enum';
import {SysConfigService} from 'src/app/shared/service/sys-config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentResponse} from './../../../dto/payment-response.model';
import {PaymentDto} from './../../../dto/payment-dto';
import {PaymentService} from './../../../service/payment.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RequestResponse} from './../../../dto/request-response.model';
import {CurrencyPipe} from '@angular/common';
import {AuthorizeRequestService} from '../../../service/authorize-request.service';
import {NewNotaryRegistrationWorkflowStage} from '../../../enum/new-notary-registration-workflow-stage.enum';
import {RequestData} from '../../../dto/request-data.model';
import {DocumentDto} from '../../../dto/document-list';
import {TokenStorageService} from '../../../auth/token-storage.service';
import {SysMethodsService} from '../../../service/sys-methods.service';
import {SnackBarService} from '../../../service/snack-bar.service';
import {SystemService} from '../../../service/system.service';
import {CommonStatus} from '../../../enum/common-status.enum';
import {UserType} from '../../../enum/user-type.enum';
import {Notary} from '../../../dto/notary.model';
import {v1 as uuid} from 'uuid';
import {Workflow} from '../../../enum/workflow.enum';
import {CitizenDTO} from '../../../dto/citizen-dto';
import {TempData} from '../../../dto/temp-data.model';
import {WorkflowStageCitizenReg} from '../../../enum/workflow-stage-citizen-reg.enum';
import {SearchRequestService} from '../../../service/search-request.service';
import {SearchRequestWorkflowStages} from '../../../enum/search-request-workflow-stages.enum';
import {ExtractRequestWorkflowStages} from '../../../enum/extract-request-workflow-stages.enum';
import {ExtractRequestService} from '../../../service/extract-request.service';
import {NameChangeWorkflowStagesEnum} from '../../../enum/name-change-workflow-stages.enum';
import {ChangeNameService} from '../../../service/change-name.service';
import {LanguageChangeService} from '../../../service/language-change.service';
import {LanguageChangeWorkflowStages} from '../../../enum/language-change-workflow-stages.enum';
import {JudicialChangeWorkflowStagesEnum} from '../../../enum/judicial-change-workflow-stages.enum';
import {JudicialService} from '../../../service/change-judicial-service';

const FOR_SAVE = 1;
const FOR_UPDATE = 2;

@Component({
  selector: 'app-online-method',
  templateUrl: './online-method.component.html',
  styleUrls: ['./online-method.component.css']
})
export class OnlineMethodComponent implements OnInit {
  @Input() transactionRef: string;
  @Input() paymentAmount: number;
  @Input() deliveryAmount: number;
  @Input() deliveryType: number;
  @Input() returnUrl: string;
  @Input() workflowStageCode: string;
  @Input() userType: string;
  @Input() userId: number = 0;

  serviceCode = SysConfigService.LGPS_SERVICE_CODE;
  showEncryptedPaymentRequest = false;
  showPaymentResult = false;
  isPaymentFailed: boolean = false;
  loadIframe = false;
  enablePayment = false;
  paymentId: number;
  lgpsUrl = SysConfigService.LGPS_PAYMENT_URL;
  result: PaymentResponse;
  isLoading: boolean = false;

  CommonStatus = CommonStatus;

  onlinePaymentForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              // private paymentService: PaymentService,
              private authorizeRequestService: AuthorizeRequestService,
              private searchRequestService: SearchRequestService,
              private extractRequestService: ExtractRequestService,
              private nameChangeService: ChangeNameService,
              private languageChangeService: LanguageChangeService,
              private judicialService: JudicialService,
              private route: ActivatedRoute,
              private tokenStorageService: TokenStorageService,
              private sysMethodsService: SysMethodsService,
              private systemService: SystemService,
              private snackBar: SnackBarService,
              private router: Router) {
  }

  ngOnInit() {
    // set payment confirmation details if payment id not available
    if (!this.route.snapshot.paramMap.get('paymentId')) {

      this.loadForm();
      this.showEncryptedPaymentRequest = true;
      this.initTransaction();
    }
    // show payment summary
    if (this.route.snapshot.paramMap.get('paymentId')) {
      this.paymentId = +this.route.snapshot.paramMap.get('paymentId');
      this.loadForm();
      this.showPaymentResult = true;
      this.isLoading = true;
      this.getPaymentResult(this.paymentId);
      this.returnUrl = this.route.snapshot.paramMap.get('url');
      this.workflowStageCode = this.decodeBase64(this.route.snapshot.paramMap.get('workflowStageCode'));
      this.userType = this.decodeBase64(this.route.snapshot.paramMap.get('userType'));
      this.userId = +this.decodeBase64(this.route.snapshot.paramMap.get('userId'));
    }
  }

  // payment form
  loadForm(): void {
    this.onlinePaymentForm = this.formBuilder.group({
      applicationAmount: [this.paymentAmount, null],
      transactionRef: [this.transactionRef, null],
      encryptedPaymentRequest: [null, null],
      totalFee: [null, null],
      paymentStatusMsg: [null, null]
    });
    this.onlinePaymentForm.disable();
  }

  get applicationAmount() {
    return this.onlinePaymentForm.get('applicationAmount');
  }

  get totalFee() {
    return this.onlinePaymentForm.get('totalFee');
  }


  // payment confirmation
  initTransaction(): void {
    let paymentDetails = new PaymentDto();
    paymentDetails = this.onlinePaymentForm.value;
    paymentDetails.deliveryType = this.deliveryType;
    paymentDetails.deliveryAmount = this.deliveryAmount;
    paymentDetails.serviceCode = this.serviceCode;
    paymentDetails.returnUrl = this.returnUrl;
    paymentDetails.workflowStageCode = this.workflowStageCode ?
      this.getBase64(this.workflowStageCode).split('=')[0] :
      this.getBase64(WorkflowStages.NON_REGISTRATION_WORKFLOW_STAGE).split('=')[0];
    paymentDetails.userType = this.getBase64(this.userType).split('=')[0];
    paymentDetails.userId = this.getBase64(this.userId ? this.userId.toString() : '0').split('=')[0];
    this.authorizeRequestService.confirmOnlinePayment(paymentDetails).subscribe(
      (result: PaymentResponse) => {
        this.onlinePaymentForm.patchValue({
          encryptedPaymentRequest: result.encriptedPaymentResponse,
          totalFee: result.totalFee
        });
      },
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.enablePayment = true;
        if (this.isPaymentFailed) {
          window.location.href = this.lgpsUrl + this.onlinePaymentForm.get('encryptedPaymentRequest').value;
        }
      }
    );
  }

  ConfirmPayment(): void {
    if (!this.showPaymentResult) {
      window.location.href = this.lgpsUrl + this.onlinePaymentForm.get('encryptedPaymentRequest').value;
    } else {
      this.router.navigateByUrl(this.decodeBase64(this.returnUrl));
    }
  }

  sendMail() {
    // generate email
    const mailData = new PaymentDto();
    mailData.workflowStageCode = this.workflowStageCode;
    mailData.userType = this.userType;
    mailData.userId = this.userId.toString();
    mailData.paymentId = this.paymentId;

    this.authorizeRequestService.generateMail(mailData).subscribe(
      (response: RequestResponse) => {
      }
    );
  }

  getPaymentResult(id: number): void {
    this.authorizeRequestService.getOnlinePaymentResult(id).subscribe(
      (result: PaymentResponse) => {
        // this.onlinePaymentForm.patchValue(result);
        this.result = result;
      }, (error) => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.isPaymentFailed = this.result.paymentStatusCode === CommonStatus.FAIL;
        if (!this.isPaymentFailed && this.userId && this.userId !== 0) {
          this.sendMail();
        }
        if (!this.isPaymentFailed) {
          this.getTempData(FOR_SAVE);
        }
      }
    );
  }

  decodeBase64(code: string): string {
    return atob(code);
  }

  getBase64(url: string): string {
    return btoa(url);
  }

  getTempData(type: any) {
    let tempDataId;
    if (this.workflowStageCode && this.workflowStageCode == WorkflowStages.REGISTRATION_REQ_INITIALIZED) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_REGISTRATION_KEY);
    } else if (this.workflowStageCode && (this.workflowStageCode == WorkflowStageCitizenReg.CITIZEN_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.BANK_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.STATE_INSTITUTE_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT)) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.CITIZEN_REGISTRATION_KEY);
    } else if (this.workflowStageCode == SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED_FOR_ARL) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.SEARCH_REQUEST_KEY);
    } else if (this.workflowStageCode == ExtractRequestWorkflowStages.EXTRACT_REQ_INITIALIZED_FOR_ARL) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.EXTRACT_REQUEST_KEY);
    } else if (this.workflowStageCode == NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_NAME_CHANGE_KEY);
    } else if (this.workflowStageCode == LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_LANGUAGE_CHANGE_KEY);
    } else if (this.workflowStageCode == JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIATED) {
      tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_JUDICIAL_CHANGE_KEY);
    }
    if (tempDataId) {
      this.authorizeRequestService.getTempDataById(tempDataId).subscribe(
        (tempData: TempData) => {
          if (tempData) {
            if (type == FOR_SAVE) this.saveApplicationDetails(JSON.parse(tempData.tempData),tempDataId);
            if (type == FOR_UPDATE) this.updateTransactionRef(tempData);
          }
        });
    }

  }

  saveApplicationDetails(requestData: RequestData,tempDataId) {
    let documentList: any | DocumentDto[];
    let other1: any;

    if (this.workflowStageCode && this.workflowStageCode == WorkflowStages.REGISTRATION_REQ_INITIALIZED) {

      if (requestData.documentData) {
        documentList = this.sysMethodsService.getDocumentListWithFileFromDocumentListFileBase64(JSON.parse(requestData.documentData));
      }
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (documentList && other1)
        this.authorizeRequestService.saveNotaryDetails(documentList, other1).subscribe(
          value => {
            if (value) {
              this.userId = value;
              this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.REGISTRATION_SUCCESS'));
              this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_REGISTRATION_KEY);
              this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            }
          }, (error) => {
          },
          () => {
            if (this.userId && this.userId !== 0)
              this.sendMail();
          }
        );
    } else if (this.workflowStageCode && (this.workflowStageCode == WorkflowStageCitizenReg.CITIZEN_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.BANK_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.STATE_INSTITUTE_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT)) {

      if (requestData.documentData) {
        documentList = this.sysMethodsService.getDocumentListWithFileFromDocumentListFileBase64(JSON.parse(requestData.documentData));
      }
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (documentList && other1)
        this.authorizeRequestService.saveCitizenAndFormData(documentList, other1).subscribe(
          value => {
            if (value) {
              this.userId = value.id;
              this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.REGISTRATION_SUCCESS'));
              this.tokenStorageService.removeFormData(this.tokenStorageService.CITIZEN_REGISTRATION_KEY);
              this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            }
          }, (error) => {
          },
          () => {
            if (this.userId && this.userId !== 0)
              this.sendMail();
          }
        );
    } else if (this.workflowStageCode == SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED_FOR_ARL) {
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (other1)
        this.searchRequestService.saveSearchRequest(other1).subscribe(
          value => {
            if (value)
              this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SEARCH_REQ_SUCCESS'));
            this.tokenStorageService.removeFormData(this.tokenStorageService.SEARCH_REQUEST_KEY);
            this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
          }
        );
    } else if (this.workflowStageCode == ExtractRequestWorkflowStages.EXTRACT_REQ_INITIALIZED_FOR_ARL) {
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (other1)
        this.extractRequestService.saveExtractRequest(other1).subscribe(
          value => {
            if (value)
              this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.EXTARCT_REQ_SUCCESS'));
            this.tokenStorageService.removeFormData(this.tokenStorageService.EXTRACT_REQUEST_KEY);
            this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
          }
        );
    } else if (this.workflowStageCode == NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED) {
      if (requestData.documentData) {
        documentList = this.sysMethodsService.getDocumentListWithFileFromDocumentListFileBase64(JSON.parse(requestData.documentData));
      }
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (documentList && other1) {
        this.nameChangeService.save(documentList, other1).subscribe(
          value => {
            if (value) {
              this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.NAME_CHG_SUCCESS'));
              this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_NAME_CHANGE_KEY);
              this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            }
          }
        );
      }
    } else if (this.workflowStageCode == LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT) {
      if (requestData.documentData) {
        documentList = this.sysMethodsService.getDocumentListWithFileFromDocumentListFileBase64(JSON.parse(requestData.documentData));
      }
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (documentList && other1) {
        this.languageChangeService.saveLanguageChange(documentList,other1).subscribe(
          value => {
            if(value){
              this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
              this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_LANGUAGE_CHANGE_KEY);
              this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            }
          }
        );
      }
    } else if (this.workflowStageCode == JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIATED) {
      if (requestData.documentData) {
        documentList = this.sysMethodsService.getDocumentListWithFileFromDocumentListFileBase64(JSON.parse(requestData.documentData));
      }
      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (documentList && other1) {
        this.judicialService.save(documentList,other1).subscribe(
          value => {
            if(value){
              this.snackBar.success('Judicial Change Request Save Success');
              this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_JUDICIAL_CHANGE_KEY);
              this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            }
          }
        );
      }
    }
  }

  resultConfirm() {
    if (!this.isPaymentFailed) {
      this.router.navigateByUrl(this.decodeBase64(this.returnUrl));
    } else {
      this.tryAgain();
    }
  }

  tryAgain() {
    this.isLoading = true;
    this.transactionRef = this.serviceCode.substring(0, 4) + uuid();
    this.paymentAmount = +this.result.totalFee;
    this.deliveryType = this.result.deliveryType;
    this.deliveryAmount = this.result.deliveryFee;
    this.onlinePaymentForm.patchValue({
      'applicationAmount': this.paymentAmount,
      'transactionRef': this.transactionRef
    });
    this.getTempData(FOR_UPDATE);
  }

  onCancel() {
    this.router.navigateByUrl(this.decodeBase64(this.returnUrl));
  }

  updateTransactionRef(tempData: TempData) {

    let other1: any | Notary | CitizenDTO;
    let payment: any | PaymentDto;
    let requestData: RequestData = JSON.parse(tempData.tempData);

    if (this.workflowStageCode && (this.workflowStageCode == WorkflowStages.REGISTRATION_REQ_INITIALIZED ||
      this.workflowStageCode == NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED ||
      this.workflowStageCode == LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT ||
      this.workflowStageCode == JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIATED)) {

      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (requestData.paymentData) {
        payment = JSON.parse(requestData.paymentData);
      }
      payment.referenceNo = this.transactionRef;
      requestData.paymentData = JSON.stringify(payment);
      other1.payment = payment;
      requestData.otherData1 = JSON.stringify(other1);

    } else if (this.workflowStageCode && (this.workflowStageCode == WorkflowStageCitizenReg.CITIZEN_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.BANK_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.STATE_INSTITUTE_INIT ||
      this.workflowStageCode == WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT)) {

      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (requestData.paymentData) {
        payment = JSON.parse(requestData.paymentData);
      }
      payment.referenceNo = this.transactionRef;
      requestData.paymentData = JSON.stringify(payment);
      other1.payment = payment;
      requestData.otherData1 = JSON.stringify(other1);
    } else if (this.workflowStageCode == SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED_FOR_ARL ||
      this.workflowStageCode == ExtractRequestWorkflowStages.EXTRACT_REQ_INITIALIZED_FOR_ARL) {

      if (requestData.otherData1) {
        other1 = JSON.parse(requestData.otherData1);
      }
      if (requestData.paymentData) {
        payment = JSON.parse(requestData.paymentData);
      }

      payment.referenceNo = this.transactionRef;
      requestData.paymentData = JSON.stringify(payment);
      other1.payment = payment;
      requestData.otherData1 = JSON.stringify(other1);
    }

    tempData.tempData = JSON.stringify(requestData);

    this.authorizeRequestService.updateTempData(tempData).subscribe(
      value => {
        if (value) {
          this.initTransaction();
        }
      }
    )
  }
}
