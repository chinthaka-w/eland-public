import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from './../../../dto/payment-response.model';
import { PaymentDto } from './../../../dto/payment-dto';
import { PaymentService } from './../../../service/payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-online-method',
  templateUrl: './online-method.component.html',
  styleUrls: ['./online-method.component.css']
})
export class OnlineMethodComponent implements OnInit {
@Input() transactionRef: string;
@Input() paymentAmount: number;
@Input() returnUrl: string;
serviceCode = 'TEST10001';
showEncryptedPaymentRequest = false;
showPaymentResult = false;
paymentId: number;
lgpsUrl = 'https://testlgps.lankagate.gov.lk:9443/lgps/accesslgps?clientPaymentRequest=';

onlinePaymentForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    // set payment confirmation details if payment id not available
    if (!this.route.snapshot.paramMap.get('id')) {

      this.loadForm();
      this.showEncryptedPaymentRequest = true;
      this.initTransaction();
    }
    // show payment summary
    if (this.route.snapshot.paramMap.get('id')) {
      this.paymentId = +this.decodeBase64(this.route.snapshot.paramMap.get('id'));
      this.loadForm();
      this.showPaymentResult = true;
      this.getPaymentResult(this.paymentId);
      this.returnUrl = this.decodeBase64(this.route.snapshot.paramMap.get('url'));
    }
  }

  // payment form
  loadForm(): void {
    this.onlinePaymentForm = this.formBuilder.group({
      applicationAmount: [this.paymentAmount, null],
      transactionRef: [this.transactionRef, null],
      serviceCode: [this.serviceCode, null],
      encryptedPaymentRequest: [null, null],
      totalFee: [null, null],
      paymentStatusMsg: [null, null]
    });
    this.onlinePaymentForm.disable();
  }

  // payment confirmation
  initTransaction(): void {
    let paymentDetails = new PaymentDto();
    paymentDetails = this.onlinePaymentForm.value;
    paymentDetails.returnUrl = this.returnUrl;

    this.paymentService.confirmOnlinePayment(paymentDetails).subscribe(
      (result: PaymentResponse) => {
        this.onlinePaymentForm.patchValue({
          encryptedPaymentRequest: result.encriptedPaymentResponse,
          totalFee: result.totalFee
        });
      }
    );
  }

  ConfirmPayment(): void {
    if (!this.showPaymentResult) {
      window.location.href = this.lgpsUrl + this.onlinePaymentForm.get('encryptedPaymentRequest').value;
    } else {
      this.router.navigate(['/', this.returnUrl]);
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

}
