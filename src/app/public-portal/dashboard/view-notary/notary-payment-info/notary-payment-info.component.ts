import { Component, OnInit } from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";
import {ApplicationRequestDataType} from "../../../../shared/enum/application-request-data-type.enum";
import {NewNotaryPaymentDetailDto} from "../../../../shared/dto/new-notary-payment-detail.dto";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";

@Component({
  selector: 'app-notary-payment-info',
  templateUrl: './notary-payment-info.component.html',
  styleUrls: ['./notary-payment-info.component.css']
})
export class NotaryPaymentInfoComponent implements OnInit {
  paymentDetails: NewNotaryPaymentDetailDto[] = [];

  constructor(private notaryService: NewNotaryDataVarificationService) { }

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
        console.log(error);
      }
    )
  }
}
