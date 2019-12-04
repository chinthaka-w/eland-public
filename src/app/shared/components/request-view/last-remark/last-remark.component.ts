import {Component, Input, OnInit} from '@angular/core';
import {Workflow} from '../../../enum/workflow.enum';
import {SearchRequestService} from '../../../service/search-request.service';
import {ExtractRequestService} from '../../../service/extract-request.service';
import {LastRemark} from '../../../dto/last-remark.model';

@Component({
  selector: 'app-last-remark',
  templateUrl: './last-remark.component.html',
  styleUrls: ['./last-remark.component.css']
})
export class LastRemarkComponent implements OnInit {

  @Input() workflow: string;
  @Input() requestId: number;

  public lastRemark: LastRemark = new LastRemark();

  constructor(private searchRequestService: SearchRequestService,
              private extractRequestService: ExtractRequestService,) {
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    switch (this.workflow) {
      case Workflow.SEARCH_REQUEST:
        this.loadSearchRequest();
        break;
      case Workflow.EXTRACT_REQUEST:
        this.loadExtractRequest();
        break;
    }
  }

  loadSearchRequest() {
    this.searchRequestService.findLastRemark(this.requestId).subscribe(
      (data: LastRemark) => {
        if (data != null) {
          this.lastRemark = data;
        }
      }
    );
  }

  loadExtractRequest() {
    this.extractRequestService.findLastRemark(this.requestId).subscribe(
      (data: LastRemark) => {
        if (data != null) {
          this.lastRemark = data;
        }
      }
    );
  }
}
