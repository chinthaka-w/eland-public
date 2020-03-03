import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {HttpErrorResponse} from '@angular/common/http';
import {PaymentMethod} from '../../../enum/payment-method.enum';
import {JsonFormatter} from 'tslint/lib/formatters';
import {CommonStatus} from '../../../enum/common-status.enum';
import {PaymentStatus} from '../../../enum/payment-status.enum';
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  @Output() response = new EventEmitter<PaymentResponse>();
  @Input() paymentDTO: PaymentDto;


  public paymentMethodForm: FormGroup;

  public isSubmitted: boolean;
  public banks: Bank[] = [];
  public branches: BankBranch[] = [];
  public files: File[] = [];

  paymentId: number;

  public paymentResponse = new PaymentResponse;

  fileUploads: ElementRef;
  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private dataRoute: ActivatedRoute,
              private snackBar: SnackBarService,
              private bankService: BankService,
              private branchService: BankBranchService,
              private paymentService: PaymentService,
              private sanitizer: DomSanitizer,
              ) { }

  ngOnInit() {
    this.paymentMethodForm = new FormGroup({
      bank: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      referenceNo: new FormControl('', Validators.required),
    });
    this.loadBanks();
  }

  savePayment() {
    let isValid = true;
    let errorMassage = '';

    if (!this.paymentMethodForm.valid) {
      isValid = false;
      errorMassage = 'Please fill application form, before submit.';
    }

    if (isValid) {this.paymentDTO.bankId = this.paymentMethodForm.get('bank').value;
    this.paymentDTO.paymentDate = this.paymentMethodForm.get('date').value;
    this.paymentDTO.referenceNo = this.paymentMethodForm.get('referenceNo').value;
    this.paymentDTO.status = CommonStatus.ACTIVE;

    let formData = new FormData();
    formData.append('model',JSON.stringify(this.paymentDTO));
    formData.append('file',this.files[0]);
    this.paymentService.savePayment(formData).subscribe(
      (res: PaymentDto) => {
        this.paymentResponse.paymentId = res.paymentId;
        this.isSubmitted = true;
        this.paymentId = res.paymentId;this.paymentResponse.paymentStatusCode = PaymentStatus.PAYMENT_SUCCESS;
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.paymentResponse.paymentStatusCode = PaymentStatus.PAYMENT_FAILED;
        this.response.emit(this.paymentResponse);
      }, () => {
        this.response.emit(this.paymentResponse);
      }
    );
} else {
      this.snackBar.error(errorMassage);
    }
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
    this.files = data;
  }

  onChangeBank(data: any) {
    this.getAllBranchByBankId(data);
  }

}
