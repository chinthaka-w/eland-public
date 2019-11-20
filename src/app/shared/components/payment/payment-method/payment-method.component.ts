import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../dto/notary';
import {NotaryService} from '../../../../shared/service/notary-service';
import { AddNotaryComponent } from 'src/app/public-portal/notary-registration/add-notary/add-notary.component';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  @ViewChild(AddNotaryComponent , {static: false})
  @Input() notaryDetails: Notary;
  private addNotaryComponent: AddNotaryComponent;
  public paymentMethodForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              ) { }

  ngOnInit() {
    this.paymentMethodForm = new FormGroup({
      bank: new FormControl('' ),
      date: new FormControl('' ),
      referenceNo: new FormControl('')
    });
  }

  savePayment() {
    // this.notaryService.saveNotaryDetails(this.notaryDetails).subscribe(
    //   (success: string) => {
    //     alert('sucesss....');
    //   }
    // );
  }

}
