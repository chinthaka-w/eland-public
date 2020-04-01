import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Workflow} from '../../../enum/workflow.enum';
import {SearchRequestService} from '../../../service/search-request.service';
import {ExtractRequestService} from '../../../service/extract-request.service';
import {LastRemark} from '../../../dto/last-remark.model';
import {JudicialService} from '../../../service/change-judicial-service';
import {NewNotaryRequestsCategorySearchDto} from '../../../dto/new-notary-requests-category-search.dto';
import {NotaryRegistrationHistoryDto} from '../../../dto/notary-registration-history.dto';
import {NewNotaryDataVarificationService} from '../../../service/new-notary-data-varification.service';
import {NotaryService} from '../../../service/notary-service';

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
              private newNotaryDataVerificationService: NewNotaryDataVarificationService,
              private notaryService: NotaryService,
              private extractRequestService: ExtractRequestService,
              private judicialService: JudicialService) {
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
      case Workflow.JUDICIAL_ZONE_CHANGE:
        this.loadJudicialChangeRequest();
        break;
      case Workflow.NOTARY_REGISTRATION:
        this.loadNotaryRegistrationRequest();
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

  loadJudicialChangeRequest() {
    this.judicialService.findLastRemark(this.requestId).subscribe(
      (data: LastRemark) => {
        if (data != null) {
          this.lastRemark = data;
        }
      }
    );
  }

  loadNotaryRegistrationRequest() {
    this.notaryService.findLastRemark(this.requestId).subscribe(
      (data: LastRemark) => {
        if (data != null) {
          this.lastRemark = data;
        }
      }
    )
  }


}
