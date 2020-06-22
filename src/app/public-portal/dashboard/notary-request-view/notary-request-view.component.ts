import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Workflow} from '../../../shared/enum/workflow.enum';
import {NotaryRequestService} from '../../../shared/service/notary-request.service';
import {SessionService} from '../../../shared/service/session.service';
import {NotaryRequestView} from '../../../shared/custom-model/notary-request-view.model';

@Component({
  selector: 'app-notary-request-view',
  templateUrl: './notary-request-view.component.html',
  styleUrls: ['./notary-request-view.component.css']
})
export class NotaryRequestViewComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public newButtonURL: string;
  public headerText;
  public title;
  public requests: NotaryRequestView[];
  public actionButtonURL: string;

  workflow;
  notaryId;
  dataSource: MatTableDataSource<any>;

  public displayedColumns: string[] = ['requestId', 'workFlowStageDescription', 'createdDate', 'lastUpdatedDate' , 'action'];

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService,
              private notaryRequestService: NotaryRequestService) {
    this.route.params.subscribe(params => {
      this.workflow = atob(params['workflow']);
    });
    this.notaryId = this.sessionService.getUser().id;
    this.setTitle();
    this.loadRequests();
  }

  setTitle() {
    if (this.workflow === Workflow.NOTARY_NAME_CHANGE) {
      // this.headerText = 'Notary Name Change';
      // this.title = 'Notary Name Change Requests';
      this.newButtonURL = '/change-the-name';
      this.actionButtonURL = `/change-name-request-view/` + this.getBase64(this.workflow) + '/';
    }
  }

  ngOnInit() {
  }

  applyFilter(value){
    
  }

  loadRequests() {
    this.notaryRequestService.findRequestByNotaryAndWorkFlow(this.notaryId, this.workflow).subscribe(
      (data: NotaryRequestView[]) => {
        this.requests = data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error1 => {

      }
    );
  }

  getBase64(value: string): string {
    return btoa(value);
  }
}
