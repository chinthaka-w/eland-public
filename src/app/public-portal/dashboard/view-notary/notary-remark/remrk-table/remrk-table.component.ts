import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from '../../../../../shared/dto/new-notary-requests-category-search.dto';
import {NotaryRegistrationHistoryDto} from '../../../../../shared/dto/notary-registration-history.dto';
import {ActivatedRoute} from '@angular/router';
import {NewNotaryDataVarificationService} from '../../../../../shared/service/new-notary-data-varification.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {NewNotaryPaymentDetailDto} from '../../../../../shared/dto/new-notary-payment-detail.dto';
import {RequestSearchDetailDTO} from "../../../../../shared/dto/request-search.dto";

@Component({
  selector: 'app-remrk-table',
  templateUrl: './remrk-table.component.html',
  styleUrls: ['./remrk-table.component.css'],
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
export class RemrkTableComponent implements OnInit, OnChanges {
  @Input() notaryRequestHistory: NotaryRegistrationHistoryDto[] = [];
  @Input() requestRemarks: RequestSearchDetailDTO;
  public requestId: RequestSearchDetailDTO;

  displayedColumns: string[] = ['Workflow Stage', 'Remark', 'Created Time', 'Created User'];
  dataSource = new MatTableDataSource<NotaryRegistrationHistoryDto>(this.notaryRequestHistory);


  constructor(private notaryService: NewNotaryDataVarificationService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getHistoryDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notaryRequestHistory']) {
      this.dataSource.data = this.notaryRequestHistory;
    }
  }

  getHistoryDetails(){
    this.dataSource.data = this.notaryRequestHistory;
  }
}
