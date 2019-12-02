import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NewNotaryPaymentDetailDto} from "../../../../shared/dto/new-notary-payment-detail.dto";
import {MatTableDataSource} from "@angular/material/table";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";
import {ApplicationRequestDataType} from "../../../../shared/enum/application-request-data-type.enum";

@Component({
  selector: 'app-citizen-payment-info',
  templateUrl: './citizen-payment-info.component.html',
  styleUrls: ['./citizen-payment-info.component.css'],
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
export class CitizenPaymentInfoComponent implements OnInit {

  paymentDetails: NewNotaryPaymentDetailDto[] = [];


  displayedColumns: string[] = ['Application No', 'Payment Method', 'Amount', 'Payment ID', 'Payment Date', 'Status'];
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
        console.log(error);
      }
    )
  }

}
