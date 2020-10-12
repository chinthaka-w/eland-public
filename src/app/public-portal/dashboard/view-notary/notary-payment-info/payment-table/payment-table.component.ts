import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from '../../../../../shared/dto/new-notary-requests-category-search.dto';
import {ActivatedRoute} from '@angular/router';
import {NewNotaryDataVarificationService} from '../../../../../shared/service/new-notary-data-varification.service';
import {NewNotaryPaymentDetailDto} from '../../../../../shared/dto/new-notary-payment-detail.dto';
import {ApplicationRequestDataType} from '../../../../../shared/enum/application-request-data-type.enum';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {RequestSearchDetailDTO} from "../../../../../shared/dto/request-search.dto";
import {MatDialog, MatDialogConfig, MatPaginator} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {PaymentMethod} from '../../../../../shared/enum/payment-method.enum';
import {PaymentStatus} from '../../../../../shared/enum/payment-status.enum';
import {PaymentMode} from '../../../../../shared/enum/payment-mode.enum';
import {PaymentService} from '../../../../../shared/service/payment.service';
import {DocumentViewerComponent} from '../../../../../shared/components/document-viewer/document-viewer.component';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class PaymentTableComponent implements OnInit, OnChanges {
  @Input() paymentDetails: NewNotaryPaymentDetailDto[] = [];
  displayedColumns: string[] = ['Payment ID', 'Payment Method', 'Payment Date', 'Amount', 'Status','Document'];
  dataSource = new MatTableDataSource<any>(this.paymentDetails);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  PaymentMode = PaymentMode;

  isLoading:boolean = false;

  constructor(private notaryService: NewNotaryDataVarificationService,
              public translateService: TranslateService,
              public paymentService: PaymentService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
     this.getPaymentDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentDetails']) {
      this.dataSource.data = this.paymentDetails;
      this.dataSource.paginator = this.paginator;
    }
  }
  getPaymentDetails() {
   this.dataSource.data = this.paymentDetails;
   this.dataSource.paginator = this.paginator;
  }

  viewDocument(row:any) {
    this.isLoading = true
    this.paymentService.getPaymentDocuments(+row.paymentId).subscribe(
      (value:any) => {
        this.isLoading = false
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          files: value.data
        };
        dialogConfig.width = '90vw';
        dialogConfig.height = '98vh';
        // dialogConfig.minHeight = '50vh';
        let dialogRef = this.dialog.open(DocumentViewerComponent, dialogConfig);
      }
    )
  }
}
