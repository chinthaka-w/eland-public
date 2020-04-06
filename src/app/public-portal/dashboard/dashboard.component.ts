import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Workflow} from '../../shared/enum/workflow.enum';
import {SessionService} from 'src/app/shared/service/session.service';
import {UserType} from 'src/app/shared/enum/user-type.enum';
import {NotaryService} from '../../shared/service/notary-service';
import {RequestSearchDetailDTO} from '../../shared/dto/request-search.dto';
import {CommonStatus} from '../../shared/enum/common-status.enum';
import {MatDialog} from '@angular/material';
import {FolioViewComponent} from 'src/app/shared/components/folio-view/folio-view.component';
import {FolioService} from 'src/app/shared/service/folio.service';
import {SnackBarService} from 'src/app/shared/service/snack-bar.service';
import {FolioDto} from 'src/app/shared/dto/folio-dto.model';
import {DocumentType} from 'src/app/shared/enum/document-type.enum';
import {SystemService} from 'src/app/shared/service/system.service';
import {NewNotaryRegistrationWorkflowStage} from '../../shared/enum/new-notary-registration-workflow-stage.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user;
  userType = UserType;
  Workflow = Workflow;

  NotrayWorkflowStage = NewNotaryRegistrationWorkflowStage;

  public searchDetails: RequestSearchDetailDTO;
  public dashboardView: boolean = false;
  public requestView: boolean = false;
  public notaryId: number;

  commonStatus = CommonStatus;

  folioPending: boolean = false;
  folioNo = 'Y/1/1';

  constructor(
    private sessionService: SessionService,
    private notaryService: NotaryService,
    private dialog: MatDialog,
    private folioService: FolioService,
    private snackbar: SnackBarService,
    private systemService: SystemService
  ) {
  }

  ngOnInit() {
    this.dashboardView = true;
    this.requestView = false;
    this.user = this.sessionService.getUser();
    this.notaryId = this.user.id;
    if (this.user.type == this.userType.NOTARY) this.getUserDetails();
  }

  getBase64(value: string): string {
    return btoa(value);
  }

  getUserDetails() {
    this.notaryService.getNotaryRequestDetails(this.user.id).subscribe(
      (data: RequestSearchDetailDTO) => {
        this.searchDetails = data;
      }
    )
  }

  viewDetails() {
    this.dashboardView = false;
    this.requestView = true;
  }

  getStatus(): string {
    let status = 'Pending Approval';
    if (this.searchDetails) {

      switch (this.searchDetails.workflow) {
        case NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_SC_ISSUED:
          status = 'Approved';
          break;
        case NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_ARG_APPROVED:
          status = 'Approved';
          break;
        case NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_DVC_REJECTED:
          status = 'Further Document Pending';
          break;
      }
    }
    return status;
  }

  viewFolio() {

    this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: this.folioNo});

    // this.folioPending = true;

    // this.folioService.getFolioType(this.folioNo, 'CLERK').subscribe(
    //   (data) => {
    //     if (data !== null) {
    //       if (data['folioTypeId'] === DocumentType.NORMAL_TRUST) this.getNormalTrustFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.EXPRESS_TRUST) this.getExpressTrustFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.GENERAL) this.getGeneralFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.CONDOMINIUM) this.getCondominiumFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.GOV_LANDS) this.getLdoFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.MOVABLE) this.getMovableFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.SPECIAL_CONDOMINIUM_DEEDS) this.getCondominiumFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //       if (data['folioTypeId'] === DocumentType.SPECIAL_DIVISION_DEEDS) this.getSpecialFolio(data['landRegistryId'] + '/' + data['folioCode']);
    //     }
    //     else {
    //       this.snackbar.warn(this.systemService.getTranslation('ALERT.TITLE.NO_RESULT'));
    //     }
    //   },
    //   error => {
    //     this.snackbar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
    //   }
    // )
  }

  getNormalTrustFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getExpressTrustFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getGeneralFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getCondominiumFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getMovableFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getLdoFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getSpecialFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.folioPending = false;
        this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: folio});
      },
      (error) => {
        this.folioPending = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  onBackNotaryView(val: boolean) {
    if (this.user.type == this.userType.NOTARY) this.getUserDetails();
    this.dashboardView = true;
    this.requestView = false;
  }
}
