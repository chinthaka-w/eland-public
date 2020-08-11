import { SystemService } from 'src/app/shared/service/system.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {Workflow} from '../../../shared/enum/workflow.enum';
import {NotaryRequestService} from '../../../shared/service/notary-request.service';
import {SessionService} from '../../../shared/service/session.service';
import {NotaryRequestView} from '../../../shared/custom-model/notary-request-view.model';
import { NameChangeWorkflowStagesEnum } from 'src/app/shared/enum/name-change-workflow-stages.enum';

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
  public isRequestUnderReview = false;
  public completeRequestSearch = false;

  public displayedColumns: string[] = ['requestId', 'workFlowStageDescription', 'createdDate', 'lastUpdatedDate' , 'action'];

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService,
              private notaryRequestService: NotaryRequestService,
              private snackBarService: SnackBarService,
              private router: Router,
              private systemService: SystemService) {
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

  loadRequests() {
    this.notaryRequestService.findRequestByNotaryAndWorkFlow(this.notaryId, this.workflow).subscribe(
      (data: NotaryRequestView[]) => {
        this.requests = data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error1 => {

      },
      () => {
        this.completeRequestSearch = true;
      }
    );
  }

  getBase64(value: string): string {
    return btoa(value);
  }

  addNew(): void {
    // check parallel request submission
    const rejectWorkflowStages: string[] = [];
    switch (this.workflow) {
      case Workflow.NOTARY_NAME_CHANGE: {
        this.checkOnPendingRequests();
        break;
      }
    }
  }

  checkOnPendingRequests() {
    if (this.requests.length > 0 && this.requests[0].workFlowStageCode !==
      NameChangeWorkflowStagesEnum.NOTARY_NAME_CHANGE_REQUEST_ISSUED_SC ) {
        this.isRequestUnderReview = true;
      }

    if (this.isRequestUnderReview) {
      this.snackBarService.warn(this.systemService.getTranslation('ALERT.MESSAGE.REQUEST_PENDING'));
    } else {
      this.router.navigate([this.newButtonURL]);
    }
  }
}
