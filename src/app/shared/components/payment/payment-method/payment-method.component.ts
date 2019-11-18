import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../../shared/model/notary';
import {NotaryService} from '../../../../shared/service/notary-service';
import {ActivatedRoute} from '@angular/router';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {AddNotaryComponent} from '../../../../public-portal/notary-registration/add-notary/add-notary.component';
import {BankService} from '../../../service/bank.service';
import {Bank} from '../../../model/bank';
import {BankBranchService} from '../../../service/bank-branch.service';
import {BankBranch} from '../../../model/bank-branch';
import {PaymentComponent} from '../payment.component';
import {Payment} from '../../../model/payment';
import {PaymentService} from '../../../service/payment.service';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  public  notaryDetails: Notary;
  private addNotaryComponent: AddNotaryComponent;
  public paymentMethodForm: FormGroup;
  public bankDetails: Bank[];
  public branchDetails: BankBranch[];
  public payment: Payment;
  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private dataRoute: ActivatedRoute,
              private snackBar: SnackBarService,
              private bankService: BankService,
              private branchService: BankBranchService,
              private paymentService: PaymentService
              ) { }

  ngOnInit() {
    this.paymentMethodForm = new FormGroup({
      bank: new FormControl('' ),
      date: new FormControl('' ),
      referenceNo: new FormControl(''),
      branch: new FormControl('')
    });
    this.getAllBanks();
  }

  savePayment() {
    this.payment = new  Payment(0, this.paymentService.getPaymentMethod(), this.paymentMethodForm.get('referenceNo').value, this.paymentMethodForm.get('date').value,
      10000, 'ACT', new Date(), new Date(), [''], this.paymentMethodForm.get('bank').value, this.paymentMethodForm.get('branch').value, 'USER');
    this.notaryDetails = this.notaryService.getNotaryDetails();
    this.notaryService.saveNotaryDetails(this.notaryDetails).subscribe(
      (success: string) => {
        this.notaryService.saveNotaryPayment(this.payment).subscribe(
          (succss: string) => {
            this.snackBar.success('Notary Payment Success');
          }
        );
        this.snackBar.success('Notary Registration Success');
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  private getAllBanks(): void {
    this.bankService.getAllBanks().subscribe(
      (data: Bank[]) => {
          this.bankDetails = data;
      }
    );
  }

  private getAllBankBranchByBankId(branch: number) {
    this.branchService.getAllBankBranchByBankId(branch).subscribe(
      (data: BankBranch []) => {
        this.branchDetails = data;
      }
    );
  }

  getBankBranch($event) {
    this.getAllBankBranchByBankId(this.paymentMethodForm.get('bank').value);
  }
}
