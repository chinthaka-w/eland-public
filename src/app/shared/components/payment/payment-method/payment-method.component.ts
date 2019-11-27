import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../dto/notary.model';
import {NotaryService} from '../../../../shared/service/notary-service';
import {ActivatedRoute} from '@angular/router';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {BankService} from '../../../service/bank.service';
import {Bank} from '../../../dto/bank.model';
import {BankBranchService} from '../../../service/bank-branch.service';
import {BankBranch} from '../../../dto/bank-branch.model';
import {PaymentDto} from '../../../dto/payment-dto';
import {PaymentService} from '../../../service/payment.service';
import {PaymentResponse} from '../../../dto/payment-response.model';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  @Output() response = new EventEmitter<PaymentResponse>();

  public paymentMethodForm: FormGroup;

  public banks: Bank[] = [];
  public branches: BankBranch[] = [];

  public payment: PaymentDto;

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
    this.loadBanks();
  }

  savePayment() {
    // this.payment = new  PaymentDto(0,this.paymentService.getPaymentMethod(),this.paymentMethodForm.value.bank, this.paymentMethodForm.value.branch,
    //   this.paymentMethodForm.value.referenceNo, this.paymentMethodForm.value.date,
    //   10000, 'ACT', new Date(),'USER', new Date());
    // this.paymentService.savePayment(this.payment).subscribe(
    //   (res) => {
    //     this.snackBar.success('Notary Payment Success');
    //     this.paymentId = res;
    //     this.responseValue.emit(this.paymentId);
    //     this.isSubmitted = true;
    //   }
    // );

  }

  private loadBanks(): void {
    this.bankService.findAll().subscribe(
      (data: Bank[]) => {
          this.banks = data;
      }
    );
  }

  private getAllBranchByBankId(bankId: number) {
    this.branchService.findAllByBankId(bankId).subscribe(
      (data: BankBranch []) => {
        this.branches = data;
      }
    );
  }


  onChangeFileInput(data: any) {
    console.log('data:',data);
  }

  onChangeBank(data: any) {
    this.getAllBranchByBankId(data);
  }

}
