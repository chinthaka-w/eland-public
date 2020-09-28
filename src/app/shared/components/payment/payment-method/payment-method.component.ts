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
import {DomSanitizer} from '@angular/platform-browser';
import {AuthorizeRequestService} from '../../../service/authorize-request.service';
import {SysMethodsService} from '../../../service/sys-methods.service';
import swal from 'sweetalert2';
import {SystemService} from '../../../service/system.service';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  @Output() response = new EventEmitter<PaymentResponse>();
  @Input() paymentDTO: PaymentDto;
  @Output() back = new EventEmitter<boolean>();
  isButtonClick = false;
  showSpinner = false;

  public paymentMethodForm: FormGroup;

  public isSubmitted: boolean;
  public banks: Bank[] = [];
  public branches: BankBranch[] = [];
  public files: File[] = [];

  toDay = new Date();

  paymentId: number;

  public paymentResponse = new PaymentResponse;

  fileUploads: ElementRef;

  popoverTitle: string = this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.CONFIRM_LEAVE');
  popoverMessage: string = 'asasdfgh';

  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private dataRoute: ActivatedRoute,
              private snackBar: SnackBarService,
              // private bankService: BankService,
              private sysMethodsService: SysMethodsService,
              private systemService: SystemService,
              private authorizeRequestService: AuthorizeRequestService,
              private branchService: BankBranchService,
              private paymentService: PaymentService,
              private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.paymentMethodForm = new FormGroup({
      bank: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      referenceNo: new FormControl('', [Validators.required, this.sysMethodsService.noWhitespaceValidator, Validators.maxLength(25)]),
    });
    this.loadBanks();
  }

  savePayment() {
    this.showSpinner = true;
    this.isButtonClick = true;
    let isValid = true;
    let errorMassage = '';

    if (!(this.paymentMethodForm.valid && this.files.length > 0)) {
      isValid = false;
      errorMassage = this.systemService.getTranslation('ALERT.MESSAGE.FILL_APP_FORM3');
      this.showSpinner = false;
      return;
    }

    if (isValid) {
      this.paymentDTO.bankId = this.paymentMethodForm.get('bank').value;
      this.paymentDTO.paymentDate = this.paymentMethodForm.get('date').value;
      this.paymentDTO.referenceNo = this.paymentMethodForm.get('referenceNo').value;
      this.paymentDTO.status = CommonStatus.ACTIVE;

      let formData = new FormData();
      formData.append('model', JSON.stringify(this.paymentDTO));
      formData.append('file', this.files[0]);
      this.authorizeRequestService.savePayment(formData).subscribe(
        (res: PaymentDto) => {
          this.paymentResponse.paymentId = res.paymentId;
          this.paymentResponse.paymentMethod = PaymentMethod.BANK_TRANSFER_OR_DIPOSIT;
          this.isSubmitted = true;
          this.paymentId = res.paymentId;
          this.paymentResponse.paymentStatusCode = PaymentStatus.PAYMENT_SUCCESS;
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
    this.authorizeRequestService.findAllBanks().subscribe(
      (data: Bank[]) => {
        this.banks = data;
      }
    );
  }

  private getAllBranchByBankId(bankId: number) {
    this.authorizeRequestService.findAllByBankId(bankId).subscribe(
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

  onBack() {
    swal.fire({
      title: this.systemService.getTranslation('ALERT.CONFIRM_MESSAGE.CONFIRM_LEAVE'),
      text:this.systemService.getTranslation('ALERT.MESSAGE.CHANGES_NOT_SAVED'),
      width:450,
      showCancelButton:true,
      cancelButtonText:this.systemService.getTranslation('BUTTONS.CANCEL_BUTTON'),
      confirmButtonText: this.systemService.getTranslation('BUTTONS.YES_BUTTON'),
    }).then((result) => {
      if (result.value) {
    this.back.emit(true);
    }
    });
  }

}
