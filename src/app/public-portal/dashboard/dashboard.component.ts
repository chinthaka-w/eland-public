import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Workflow} from '../../shared/enum/workflow.enum';
import { SessionService } from 'src/app/shared/service/session.service';
import { UserType } from 'src/app/shared/enum/user-type.enum';
import {NotaryService} from "../../shared/service/notary-service";
import {RequestSearchDetailDTO} from "../../shared/dto/request-search.dto";
import {CommonStatus} from "../../shared/enum/common-status.enum";
import {WorkflowStages} from '../../shared/enum/workflow-stages.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user;
  userType = UserType;
  Workflow = Workflow;
  public searchDetails: RequestSearchDetailDTO;
  public dashboardView: boolean = false;
  public requestView: boolean = false;
  public notaryId: number;
  public notaryNameChangeWorkFlow;

  commonStatus = CommonStatus;
  constructor(
    private sessionService: SessionService,
    private notaryService: NotaryService,
  ) {
  }

  ngOnInit() {
    this.dashboardView = true;
    this.requestView = false;
    this.user = this.sessionService.getUser();
    this.getUserDetails();
    this.notaryId = this.user.id;
    this.notaryNameChangeWorkFlow = WorkflowStages.NOTARY_NAME_CHANGE;
  }

  getBase64(value: string): string {
    return btoa(value);
  }

  getUserDetails(){
    this.notaryService.getNotaryRequestDetails(this.user.id).subscribe(
      (data: RequestSearchDetailDTO) =>{
        this.searchDetails = data;
      }
    )
  }

  viewDetails(){
    this.dashboardView = false;
    this.requestView = true;
  }
}
