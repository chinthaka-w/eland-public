import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PaymentService} from '../../service/payment.service';
import {Parameters} from '../../enum/parameters.enum';
import {ParameterService} from '../../service/parameter.service';
import {PaymentMethod} from '../../enum/payment-method.enum';
import {MatRadioChange} from '@angular/material';
import {DocumentIssueMethod} from '../../enum/document-issue-method.enum';
import {Workflow} from '../../enum/workflow.enum';
import {SnackBarService} from '../../service/snack-bar.service';
import {PaymentResponse} from '../../dto/payment-response.model';
import {PaymentStatus} from '../../enum/payment-status.enum';
import {PaymentDto} from '../../dto/payment-dto';
import {HttpErrorResponse} from '@angular/common/http';
import {CommonStatus} from '../../enum/common-status.enum';
import {v1 as uuid} from 'uuid';
import {SysMethodsService} from '../../service/sys-methods.service';
import {log} from 'util';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnChanges {

  @Output() response = new EventEmitter<PaymentResponse>();
  @Output() back = new EventEmitter<boolean>();
  @Output() paymentMethodResponse = new EventEmitter<PaymentResponse>();
  @Input() isDocumentCollect: boolean;
  @Input() hasFrontCounterPayment: boolean;
  @Input() applicationFeeCode: string;
  @Input() workflowCode: string;
  @Input() paymentReference: string;
  @Input() returnUrl: string;
  @Input() statusOnlinePayment = false;
  @Input() workflowStageCode: string;
  @Input() userType: string;
  @Input() userId: number;
  @Input() requestItemCount: number = 1;
  showSpinner: boolean;
  public isContinueToPayment: boolean = false;

  public paymentForm: FormGroup;

  public applicationAmount: number = 0;
  public issueAmount: number = 0;
  public totalAmount: number = 0;
  public newReturnUrl;

  public isSubmitted: boolean;

  PaymentMethod = PaymentMethod;
  Parameter = Parameters;
  DocumentIssueMethod = DocumentIssueMethod;
  Workflow = Workflow;

  public paymentResponse = new PaymentResponse;

  public paymentDTO = new PaymentDto;

  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService,
              private snackBar: SnackBarService,
              public sysMethodsService: SysMethodsService,
              private parameterService: ParameterService) {
  }

  ngOnInit() {
    this.paymentForm = new FormGroup({
      licenseMethod: new FormControl(''),
      paymentMethod: new FormControl('')
    });
    this.getApplicationAmount(this.applicationFeeCode);
    this.newReturnUrl = this.returnUrl ? btoa(this.returnUrl) : btoa('/dashboard');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['statusOnlinePayment']) {
      if (this.statusOnlinePayment) {
        this.isContinueToPayment = true;
        this.showSpinner = false;
      }
    }
    if (changes['returnUrl']) {
      if (this.newReturnUrl) {
        this.newReturnUrl = btoa(this.returnUrl).split('=')[0];
      }
    }
  }

  getApplicationAmount(parameterCode: any): void {
    this.parameterService.getParameterizedAmountByCode(parameterCode).subscribe(
      (value: number) => {
        if (value != null) {
          this.applicationAmount = value;
        }
      }, (error: HttpErrorResponse) => {
      }, () => {
        if (!this.requestItemCount && this.requestItemCount == 0) this.requestItemCount++;
        this.applicationAmount = (this.applicationAmount * this.requestItemCount);
        this.totalAmount = this.applicationAmount;
      }
    );
  }

  getIssueOptionAmount(parameterCode: any): void {
    this.parameterService.getParameterizedAmountByCode(parameterCode).subscribe(
      (value: number) => {
        this.issueAmount = value;
      }, (error: HttpErrorResponse) => {
      }, () => {
        this.totalAmount = this.applicationAmount + this.issueAmount;
      }
    );
  }

  get paymentMethod() {
    return this.paymentForm.get('paymentMethod').value;
  }

  get issueMethod() {
    return this.paymentForm.get('licenseMethod').value;
  }

  onChangeIssueMethod(data: MatRadioChange) {
    this.paymentResponse.deliveryType = data.value;
    switch (data.value) {
      case this.DocumentIssueMethod.BY_POST_NORMAL: {
        if (this.workflowCode == this.Workflow.NOTARY_REGISTRATION) {
          this.getIssueOptionAmount(this.Parameter.NOTARY_REG_POST_NORMAL_AMOUNT);
        } else if (this.workflowCode == this.Workflow.EXTRACT_REQUEST) {
          this.getIssueOptionAmount(this.Parameter.EXTRACT_REQ_POST_NORMAL_AMOUNT);
        } else if (this.workflowCode == this.Workflow.NOTARY_NAME_CHANGE) {
          this.getIssueOptionAmount(this.Parameter.NOTARY_NAME_CHG);
        }
        break;
      }
      case this.DocumentIssueMethod.BY_POST_REGISTERED: {
        if (this.workflowCode == this.Workflow.NOTARY_REGISTRATION) {
          this.getIssueOptionAmount(this.Parameter.NOTARY_REG_POST_REGISTERED_AMOUNT);
        } else if (this.workflowCode == this.Workflow.EXTRACT_REQUEST) {
          this.getIssueOptionAmount(this.Parameter.EXTRACT_REQ_POST_REGISTERED_AMOUNT);
        }
        break;
      }
      case this.DocumentIssueMethod.BY_HAND: {
        this.issueAmount = 0;
        this.totalAmount = this.applicationAmount;
        break;
      }
    }
  }

  onChangePaymentMethod(data: MatRadioChange) {
    this.paymentResponse.paymentMethod = data.value;
  }

  onClickContinue() {
    let isValid = true;
    let errorMassage = '';

    if (this.isDocumentCollect && this.issueMethod == 0) {
      isValid = false;
      errorMassage = 'Please, Select issue option.';
    }

    if (isValid && this.paymentMethod == 0) {
      isValid = false;
      errorMassage = 'Please, Select payment option.';
    }

    if (isValid) {
      this.showSpinner = true;
      this.paymentDTO.deliveryType = this.paymentForm.get('licenseMethod').value;
      this.paymentDTO.deliveryAmount = this.issueAmount;
      this.paymentDTO.applicationAmount = this.applicationAmount;
      this.paymentDTO.totalAmount = this.totalAmount;
      this.paymentDTO.paymentMethod = this.paymentMethod;
      if (this.paymentMethod == this.PaymentMethod.FRONT_COUNTER) {
        this.paymentDTO.status = CommonStatus.PENDING;
        this.savePayment();
      } else if (this.paymentMethod === this.PaymentMethod.ONLINE) {
        this.showSpinner = true;
        // EventEmitter emits payment method and application amount
        const paymentResponse = new PaymentResponse();
        paymentResponse.paymentMethod = PaymentMethod.ONLINE;
        paymentResponse.applicationAmount = this.totalAmount.toString();
        paymentResponse.deliveryType = this.paymentForm.get('licenseMethod').value;
        paymentResponse.deliveryAmount = this.issueAmount;
        // genereate uuid
        paymentResponse.transactionRef = uuid();
        this.paymentReference = paymentResponse.transactionRef;
        this.paymentMethodResponse.emit(paymentResponse);
      }

      else {
        this.isContinueToPayment = true;
        this.showSpinner = true;
      }
    } else {
      this.snackBar.error(errorMassage);
      this.showSpinner = false;
    }
  }

  savePayment() {

    this.paymentService.savePayment2(this.paymentDTO).subscribe(
      (res: PaymentDto) => {
        this.paymentResponse.paymentId = res.paymentId;
        this.paymentResponse.paymentMethod = this.PaymentMethod.FRONT_COUNTER;
        this.paymentResponse.paymentStatusCode = PaymentStatus.PAYMENT_TO_FRONT_COUNTER;
      }, (error: HttpErrorResponse) => {
        this.paymentResponse.paymentStatusCode = PaymentStatus.PAYMENT_FAILED;
        this.response.emit(this.paymentResponse);
      }, () => {
        this.response.emit(this.paymentResponse);
      }
    );
  }

  onPaymentResponseFromBankSlip(data: PaymentResponse) {
    this.response.emit(data);
  }

  onClickBack() {
    this.back.emit(true);
  }

  onBackFromBankSlip(result: boolean) {
    if (result) {
      this.isContinueToPayment = false;
      this.showSpinner = false;
    }
  }
}
