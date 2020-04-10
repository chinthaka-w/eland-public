import { PaymentMethod } from './../../../../shared/enum/payment-method.enum';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource} from "@angular/material/table";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {ActivatedRoute} from "@angular/router";
import {CitizenDTO} from "../../../../shared/dto/citizen-dto";
import {PaymentResponse} from "../../../../shared/dto/payment-response.model";
import {CitizenService} from "../../../../shared/service/citizen.service";
import {PaymentDto} from "../../../../shared/dto/payment-dto";
import {Workflow} from "../../../../shared/enum/workflow.enum";
import {Parameters} from "../../../../shared/enum/parameters.enum";

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
  paymentDetails: Array<PaymentDto> = [];
  citizenDTO: CitizenDTO = new CitizenDTO();
  paymentDTO: PaymentDto = new PaymentDto();
  isContinue: boolean = false;
  public Parameters = Parameters;
  public WorkflowCode = Workflow;
  statusOnlinePayment = false;
  returnURl: string;

  displayedColumns: string[] = ['Payment ID', 'Payment Method', 'Amount', 'Payment Date', 'Status'];
  dataSource = new MatTableDataSource<PaymentDto>();

  constructor(private notaryService: NewNotaryDataVarificationService,
              private route: ActivatedRoute, private citizenService: CitizenService) {
  }

  ngOnInit() {
    this.citizenService.citizenDto.subscribe(history => {
      this.citizenDTO = history;
      this.dataSource = history.paymentHistory;
    });
  }

  onBack(data: boolean) {
    this.isContinue = !data;
  }

  onPaymentResponse(data: PaymentResponse) {
    this.paymentDTO.paymentId = data.paymentId;
    this.paymentDTO.deliveryType = data.deliveryType;
    this.paymentDTO.paymentMethod = data.paymentMethod;
    this.citizenDTO.payment = this.paymentDTO;
    this.citizenService.updatePayment(this.citizenDTO)
      .subscribe((result) => {
        this.citizenDTO.paymentHistory.push(result);
        this.dataSource = new MatTableDataSource(this.citizenDTO.paymentHistory);
      });
    this.isContinue = false;
  }

  addPayment() {
    this.isContinue = true;
  }

  paymentMethodResponse(data: PaymentResponse) {
    if (data.paymentMethod === PaymentMethod.ONLINE) {
      this.paymentDTO.referenceNo = data.transactionRef;
      this.paymentDTO.applicationAmount = +data.applicationAmount;
      this.paymentDTO.paymentMethod = data.paymentMethod;
      this.paymentDTO.deliveryType = data.deliveryType;
      this.citizenDTO.payment = this.paymentDTO;

      // update payment
      this.citizenService.updatePayment(this.citizenDTO).subscribe(
        (result) => {
          this.statusOnlinePayment = true;
          this.returnURl = ('view-citizen');
        }
      );
    }
  }

  getBase64(url: string): string {
    return btoa(url);
  }
}
