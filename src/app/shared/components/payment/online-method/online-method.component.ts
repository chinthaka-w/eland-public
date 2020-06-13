import { WorkflowStages } from './../../../enum/workflow-stages.enum';
import { SysConfigService } from 'src/app/shared/service/sys-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from './../../../dto/payment-response.model';
import { PaymentDto } from './../../../dto/payment-dto';
import { PaymentService } from './../../../service/payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestResponse } from './../../../dto/request-response.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-online-method',
  templateUrl: './online-method.component.html',
  styleUrls: ['./online-method.component.css']
})
export class OnlineMethodComponent implements OnInit {
@Input() transactionRef: string;
@Input() paymentAmount: number;
@Input() returnUrl: string;
@Input() workflowStageCode: string;
@Input() userType: string;
@Input() userId: number;serviceCode = SysConfigService.LGPS_SERVICE_CODE;
showEncryptedPaymentRequest = false;
showPaymentResult = false;
loadIframe = false;
enablePayment = false;
paymentId: number;
lgpsUrl = SysConfigService.LGPS_PAYMENT_URL;

  onlinePaymentForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService,
              private route: ActivatedRoute,
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
      this.getPaymentResult(this.paymentId);
      this.returnUrl = this.decodeBase64(this.route.snapshot.paramMap.get('url'));
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
    paymentDetails.serviceCode = this.serviceCode;
    paymentDetails.returnUrl = this.returnUrl;
    paymentDetails.workflowStageCode = this.workflowStageCode ?
      this.getBase64(this.workflowStageCode).split('=')[0] :
      this.getBase64(WorkflowStages.NON_REGISTRATION_WORKFLOW_STAGE).split('=')[0];
    paymentDetails.userType = this.getBase64(this.userType).split('=')[0];
    paymentDetails.userId = this.getBase64(this.userId.toString()).split('=')[0];

    this.paymentService.confirmOnlinePayment(paymentDetails).subscribe(
      (result: PaymentResponse) => {
        this.onlinePaymentForm.patchValue({
          encryptedPaymentRequest: result.encriptedPaymentResponse,
          totalFee: result.totalFee
        });
      },
      () => {},
      () => {
        this.enablePayment = true;
      }
    );
  }

  ConfirmPayment(): void {
    if (!this.showPaymentResult) {
      window.location.href = this.lgpsUrl + this.onlinePaymentForm.get('encryptedPaymentRequest').value;
    } else {
      this.router.navigateByUrl(this.returnUrl);
      // generate email
      const mailData = new PaymentDto();
      mailData.workflowStageCode = this.workflowStageCode;
      mailData.userType = this.userType;
      mailData.userId = this.userId.toString();
      mailData.paymentId = this.paymentId;

      this.paymentService.generateMail(mailData).subscribe(
        (response: RequestResponse) => {
        }
      );
    }
  }

  getPaymentResult(id: number): void {
    this.paymentService.getOnlinePaymentResult(id).subscribe(
      (result: PaymentResponse) => {
        this.onlinePaymentForm.patchValue(result);
      }
    );
  }

  decodeBase64(code: string): string {
    return atob(code);
  }

  getBase64(url: string): string {
    return btoa(url);
  }

}
