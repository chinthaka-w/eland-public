import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Input, OnInit} from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from '../../../../shared/dto/new-notary-requests-category-search.dto';
import {ApplicationRequestDataType} from '../../../../shared/enum/application-request-data-type.enum';
import {NewNotaryPaymentDetailDto} from '../../../../shared/dto/new-notary-payment-detail.dto';
import {NewNotaryDataVarificationService} from '../../../../shared/service/new-notary-data-varification.service';
import {PaymentResponse} from '../../../../shared/dto/payment-response.model';
import {PaymentComponent} from '../../../../shared/components/payment/payment.component';
import {PaymentMethodComponent} from '../../../../shared/components/payment/payment-method/payment-method.component';
import {NotaryService} from '../../../../shared/service/notary-service';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {Parameters} from '../../../../shared/enum/parameters.enum';
import {NewNotaryPaymentDto} from '../../../../shared/dto/new-notary-payment.dto';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {RequestSearchDetailDTO} from "../../../../shared/dto/request-search.dto";
import {ActionMode} from '../../../../shared/enum/action-mode.enum';

@Component({
  selector: 'app-notary-payment-info',
  templateUrl: './notary-payment-info.component.html',
  styleUrls: ['./notary-payment-info.component.css']
})
export class NotaryPaymentInfoComponent implements OnInit {
  @Output() notaryPayment = new EventEmitter<NewNotaryPaymentDto>();
  @Input() requestDetailPayment: RequestSearchDetailDTO;
  @ViewChild(PaymentComponent, {static: false}) paymentComponent: PaymentComponent;
  @ViewChild(PaymentMethodComponent, {static: false}) paymentMethodComponent: PaymentMethodComponent;
  @Input() workflow: string;
  @Input() id: number;
  @Input() action: number;
  @Output() paymentResponse = new EventEmitter<PaymentResponse>();

  paymentDetails: NewNotaryPaymentDetailDto[] = [];

  public type = ApplicationRequestDataType.PAYMENT;
  isPayment: boolean = false;
  isPaymentMethod: boolean = false;
  public payment: any;
  public paymentDataValue: number;

  Parameters = Parameters;
  WorkflowCode = Workflow;
  public requestId: RequestSearchDetailDTO;

  ActionMode = ActionMode;

  constructor(private notaryService: NewNotaryDataVarificationService,
              private newNotaryService: NotaryService,
              private snackBar: SnackBarService,) {
  }

  ngOnInit() {
    this.getPaymentDetails();
  }


  getPaymentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestDetailPayment !== undefined ? this.requestDetailPayment.requestId : this.id, this.requestDetailPayment !== undefined ? this.requestDetailPayment.workflow : this.workflow);
    this.notaryService.getPaymentDetails(searchType).subscribe(
      (result: NewNotaryPaymentDetailDto[]) => {
        this.paymentDetails = result;
      },
      error => {
      }
    )
  }

  continuePayments() {
    this.isPayment = true;
  }

  savePayments(requestId: number, paymentId: number): void {
    let requestID = requestId;
    let paymentID = paymentId;
    const model: NewNotaryPaymentDto = new NewNotaryPaymentDto(requestID, paymentID);
    this.newNotaryService.savePayments(model).subscribe(
      (result) => {
        this.notaryPayment.emit(model);
        this.snackBar.success('Payment Success');
      }
    );
  }

  getPaymentData(paymentData: PaymentResponse) {
    this.isPayment = false;
    this.isPaymentMethod = true;
    switch (this.workflow) {
      case Workflow.SEARCH_REQUEST:
          this.paymentResponse.emit(paymentData);
        break;
      case Workflow.EXTRACT_REQUEST:
          this.paymentResponse.emit(paymentData);
        break;
      default:
        this.paymentDataValue = paymentData.paymentId;
        this.savePayments(this.requestDetailPayment.requestId, this.paymentDataValue);
    }
  }

}
