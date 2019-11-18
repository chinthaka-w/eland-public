import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PaymentService} from '../../service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  public paymentForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentForm = new FormGroup({
      licenseMethod: new FormControl(0),
      paymentMethod: new FormControl(0)
    });
  }

  getPayementFormDetails() {
    this.paymentService.setPaymentMethod(this.paymentForm.get('paymentMethod').value);
  }


}
