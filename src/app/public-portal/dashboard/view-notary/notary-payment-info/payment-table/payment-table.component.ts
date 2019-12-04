import { Component, OnInit } from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from "../../../../../shared/dto/new-notary-requests-category-search.dto";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryDataVarificationService} from "../../../../../shared/service/new-notary-data-varification.service";
import {NewNotaryPaymentDetailDto} from "../../../../../shared/dto/new-notary-payment-detail.dto";
import {ApplicationRequestDataType} from "../../../../../shared/enum/application-request-data-type.enum";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource} from "@angular/material/table";
@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class PaymentTableComponent implements OnInit {
  paymentDetails: NewNotaryPaymentDetailDto[] = [];


  displayedColumns: string[] = ['Payment Method', 'Amount', 'Payment ID', 'Payment Date', 'Status'];
  dataSource = new MatTableDataSource<NewNotaryPaymentDetailDto>(this.paymentDetails);

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
        this.dataSource.data = result;
      },
      error => {
      }
    )
  }

}
