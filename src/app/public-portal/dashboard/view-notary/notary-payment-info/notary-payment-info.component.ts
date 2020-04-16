import { PaymentMethod } from './../../../../shared/enum/payment-method.enum';
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
  @Input() enablePayment = false;
  @ViewChild(PaymentComponent, {static: false}) paymentComponent: PaymentComponent;
  @ViewChild(PaymentMethodComponent, {static: false}) paymentMethodComponent: PaymentMethodComponent;
  @Input() workflow: string = Workflow.NOTARY_REGISTRATION;
  @Input() id: number;
  @Input() action: number;
  @Input() isDocumentCollect: boolean;
  @Input() hasFrontCounterPayment: boolean;
  @Input() addPayment: boolean = true;
  @Input() applicationFeeCode: string = Parameters.NOTARY_REG_FEE;
  @Output() paymentResponse = new EventEmitter<PaymentResponse>();
  returnUrl: string;
  statusOnlinePayment = false;
  paymentReturnBaseUrl: string;


  @Input() editable : boolean = false;

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
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(
      this.requestDetailPayment !== undefined ? this.requestDetailPayment.requestId : this.id,
      this.requestDetailPayment !== undefined ? Workflow.NOTARY_REGISTRATION : this.workflow);
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
      },
      (error) => {},
      () => {
        this.getPaymentDetails();
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
        // this.savePayments(this.requestDetailPayment.requestId, this.paymentDataValue);
    }
  }

  addOnlinePayment(paymentData: PaymentResponse) {
    // Add workflow wise return urls
    if (paymentData.paymentMethod === PaymentMethod.ONLINE) {
      if (this.requestDetailPayment.workflow === Workflow.JUDICIAL_ZONE_CHANGE) {
        this.paymentReturnBaseUrl = '/change-judicial-request-view/';
      }
      this.returnUrl =  this.paymentReturnBaseUrl +
      btoa(this.requestDetailPayment.workflowStage).split('=')[0] + '/' +
      btoa(this.requestDetailPayment.requestId.toString());
    }
    const model = new NewNotaryPaymentDto(this.requestDetailPayment.requestId, null);
    model.transactionRef = paymentData.transactionRef;
    model.applicationAmount = paymentData.applicationAmount;
    model.paymentMethod = paymentData.paymentMethod;
    this.newNotaryService.savePayments(model).subscribe(
      (response) => {
        this.statusOnlinePayment = true;
      }
    );
  }

  onBack(data:any){
    this.isPayment = false;
  }

}
