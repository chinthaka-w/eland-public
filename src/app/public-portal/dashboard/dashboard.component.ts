import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Workflow} from '../../shared/enum/workflow.enum';
import { SessionService } from 'src/app/shared/service/session.service';
import { UserType } from 'src/app/shared/enum/user-type.enum';
import {NotaryService} from "../../shared/service/notary-service";
import {RequestSearchDetailDTO} from "../../shared/dto/request-search.dto";
import {CommonStatus} from "../../shared/enum/common-status.enum";
import { MatDialog } from '@angular/material';
import { FolioViewComponent } from 'src/app/shared/components/folio-view/folio-view.component';
import { FolioService } from 'src/app/shared/service/folio.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { FolioDto } from 'src/app/shared/dto/folio-dto.model';

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

  commonStatus = CommonStatus;

  folioPending: boolean = false;

  constructor(
    private sessionService: SessionService,
    private notaryService: NotaryService,
    private dialog: MatDialog,
    private folioService: FolioService,
    private snackbar: SnackBarService
  ) {
  }

  ngOnInit() {
    this.dashboardView = true;
    this.requestView = false;
    this.user = this.sessionService.getUser();
    this.getUserDetails();
    this.notaryId = this.user.id;
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

  viewFolio(){

    this.folioPending = true;

    this.folioService.getExpressTrustFolio(btoa('3/Y/1/3')).subscribe(
      (folio: FolioDto) =>{
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data:folio});
      },
      (error) =>{
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }
}
