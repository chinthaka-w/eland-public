import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {PaymentDto} from '../../../model/payment-dto';
import {PaymentService} from '../../../service/payment.service';
import {NotaryPaymentDto} from '../../../model/notary-payment.dto';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  @Output() responseValue = new EventEmitter();
  public paymentMethodForm: FormGroup;
  public bankDetails: Bank[];
  public branchDetails: BankBranch[];
  public payment: PaymentDto;
  public isSubmitted: boolean;
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

  savePayment(paymentMethodForm: FormGroup) {

     this.responseValue.emit(paymentMethodForm);
     this.isSubmitted = true;
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
