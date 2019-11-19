import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PaymentService} from '../../service/payment.service';
import {Parameters} from '../../parameters';
import {ParameterService} from '../../service/parameter.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  public paymentForm: FormGroup;
  public amount: number;
  public issue: number;
  public total: number;
  public issueValue: string;

  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService,
              private parameterService: ParameterService) { }

  ngOnInit() {
    this.paymentForm = new FormGroup({
      licenseMethod: new FormControl(0),
      paymentMethod: new FormControl(0)
    });
    this.amount = Parameters.AMOUNT;
    this.issue = Parameters.ISSUE_POST;
    this.total = Parameters.TOTAL;
  }

  getPayementFormDetails() {
    this.paymentService.setPaymentMethod(this.paymentForm.get('paymentMethod').value);
  }

  getParameterValue(value: string) {
    this.parameterService.getParameterValue(value).subscribe(
      (res) => {
        alert(res);
      }
    );
  }


}
