import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../../shared/model/notary';
import {AddNotaryComponent} from '../../add-notary/add-notary.component';
import {NotaryService} from '../../../../shared/service/notary-service';
import {ActivatedRoute} from '@angular/router';
import {SnackBarService} from "../../../../shared/service/snack-bar.service";

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  public  notaryDetails: Notary;
  private addNotaryComponent: AddNotaryComponent;
  public paymentMethodForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private dataRoute: ActivatedRoute,
              private snackBar: SnackBarService
              ) { }

  ngOnInit() {
    this.paymentMethodForm = new FormGroup({
      bank: new FormControl('' ),
      date: new FormControl('' ),
      referenceNo: new FormControl('')
    });
  }

  savePayment() {
    this.notaryDetails = this.notaryService.getNotaryDetails();
    this.notaryService.saveNotaryDetails(this.notaryDetails).subscribe(
      (success: string) => {
        this.snackBar.success('Notary Registration Success');
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

}
