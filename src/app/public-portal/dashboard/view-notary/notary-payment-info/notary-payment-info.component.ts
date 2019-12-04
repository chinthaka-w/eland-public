import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";
import {ApplicationRequestDataType} from "../../../../shared/enum/application-request-data-type.enum";
import {NewNotaryPaymentDetailDto} from "../../../../shared/dto/new-notary-payment-detail.dto";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {PaymentResponse} from "../../../../shared/dto/payment-response.model";
import {PaymentComponent} from "../../../../shared/components/payment/payment.component";
import {PaymentMethodComponent} from "../../../../shared/components/payment/payment-method/payment-method.component";
import {NotaryService} from "../../../../shared/service/notary-service";
import {Workflow} from "../../../../shared/enum/workflow.enum";
import {Parameters} from "../../../../shared/enum/parameters.enum";
import {NewNotaryPaymentDto} from "../../../../shared/dto/new-notary-payment.dto";
import {SnackBarService} from "../../../../shared/service/snack-bar.service";

@Component({
  selector: 'app-notary-payment-info',
  templateUrl: './notary-payment-info.component.html',
  styleUrls: ['./notary-payment-info.component.css']
})
export class NotaryPaymentInfoComponent implements OnInit {
  @Output() notaryPayment = new EventEmitter<NewNotaryPaymentDto>();
  @ViewChild(PaymentComponent,{static: false}) paymentComponent: PaymentComponent;
  @ViewChild(PaymentMethodComponent,{static: false}) paymentMethodComponent: PaymentMethodComponent;
  paymentDetails: NewNotaryPaymentDetailDto[] = [];
  isPayment: boolean = false;
  isPaymentMethod: boolean = false;
  public payment: any;
  public paymentDataValue: number;

  Parameters = Parameters;
  WorkflowCode = Workflow;


  constructor(private notaryService: NewNotaryDataVarificationService,
              private newNotaryService: NotaryService,
              private snackBar: SnackBarService,) { }

  ngOnInit() {
    this.getPaymentDetails();
  }


  getPaymentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(1,"1");
    // this.route.paramMap.subscribe(params => {
    //   searchType.requestID = params.get('id')
    // });
    searchType.type = ApplicationRequestDataType.PAYMENT;
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

  savePayments(requestId: number , paymentId: number) :void{
    let requestID = requestId;
    let paymentID = paymentId;
    const model: NewNotaryPaymentDto = new NewNotaryPaymentDto(requestID,paymentID);
    this.newNotaryService.savePayments(model).subscribe(
      (result) => {
        this.notaryPayment.emit(model);
        this.snackBar.success("Payment Success");
      }
    );
  }

  getPaymentData(paymentData: PaymentResponse){
    this.isPayment = false;
    this.isPaymentMethod = true;
    this.paymentDataValue = paymentData.paymentId;
    this.savePayments(1,this.paymentDataValue);
  }

}
