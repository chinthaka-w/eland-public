import { Component, OnInit } from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from "../../../../../shared/dto/new-notary-requests-category-search.dto";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryDataVarificationService} from "../../../../../shared/service/new-notary-data-varification.service";
import {NewNotaryPaymentDetailDto} from "../../../../../shared/dto/new-notary-payment-detail-dto";
import {ApplicationRequestDataType} from "../../../../../shared/enum/application-request-data-type.enum";

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.css']
})
export class PaymentTableComponent implements OnInit {
  paymentDetails: NewNotaryPaymentDetailDto[] = [];

  constructor(private notaryService: NewNotaryDataVarificationService,
              private route: ActivatedRoute) {
  }

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
