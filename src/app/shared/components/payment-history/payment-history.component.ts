import { NewNotaryPaymentDetailDto } from './../../dto/new-notary-payment-detail.dto';
import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {PaymentMode} from '../../enum/payment-mode.enum';

/**
 * View Payment history information
 * @Input NewNotaryPaymentDetailDto[] Payment history array
 * @Input boolean shows add new payment configuration
 */

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit, OnChanges {
  @Input() paymentHistory: NewNotaryPaymentDetailDto[] = [];
  @Input() paymentAction: boolean;
  displayedColumns: string[] = ['Payment ID', 'Payment Method', 'Payment Date', 'Amount', 'Status'];
  dataSource = new MatTableDataSource<NewNotaryPaymentDetailDto>(this.paymentHistory);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  PaymentMode = PaymentMode;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.setPaymentHistory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentHistory']) {
      this.setPaymentHistory();
    }
  }

  setPaymentHistory(): void {
    this.dataSource.data = this.paymentHistory;
    this.dataSource.paginator = this.paginator;
  }

  addPayment(): void {

  }

}
