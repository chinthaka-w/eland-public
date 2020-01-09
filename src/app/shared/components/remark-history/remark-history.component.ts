import { NotaryRegistrationHistoryDto } from './../../dto/notary-registration-history.dto';
import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

/**
 * View remark history
 * @Input NotaryRegistrationHistoryDto[] Remark history array
 */
@Component({
  selector: 'app-remark-history',
  templateUrl: './remark-history.component.html',
  styleUrls: ['./remark-history.component.css']
})
export class RemarkHistoryComponent implements OnInit, OnChanges {
  @Input() remarkHistory: NotaryRegistrationHistoryDto[] = [];

  displayedColumns: string[] = ['Workflow Stage', 'Remark', 'Created Time', 'Created User'];
  dataSource = new MatTableDataSource<NotaryRegistrationHistoryDto>(this.remarkHistory);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.setRemarkHistory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['remarkHistory']) {
      this.setRemarkHistory();
    }
  }

  setRemarkHistory(): void {
    this.dataSource.data = this.remarkHistory;
    this.dataSource.paginator = this.paginator;
  }

}
