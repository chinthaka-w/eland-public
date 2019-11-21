import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PaymentService} from '../../service/payment.service';
import {ParametersEnum} from '../../enum/parameters.enum';
import {ParameterService} from '../../service/parameter.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Output() response = new EventEmitter();
  public paymentForm: FormGroup;
  public amount: number;
  public issue: number;
  public total: number;
  public issueValue: string;
  public isSubmitted: boolean;

  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService,
              private parameterService: ParameterService) { }

  ngOnInit() {
    this.paymentForm = new FormGroup({
      licenseMethod: new FormControl(0),
      paymentMethod: new FormControl(0)
    });
    this.amount = ParametersEnum.AMOUNT;
    this.issue = ParametersEnum.ISSUE_POST;
    this.total = this.amount;
  }

  setPaymentMethod(payment: number){
    this.paymentService.setPaymentMethod(payment);
  }

  getParameterValue(value: string): void {
    this.parameterService.getParameterValue(this.paymentForm.get('licenseMethod').value).subscribe(
      (res: number) => {
       this.issue = res;
       this.total = (this.issue + this.amount);
      }
    );
  }
  continue(paymentForm: FormGroup) {
    this.response.emit(paymentForm);
    this.isSubmitted = true;
  }


}
