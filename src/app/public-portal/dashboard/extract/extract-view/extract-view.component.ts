import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ActionMode} from '../../../../shared/enum/action-mode.enum';
import {SearchRequestWorkflowStages} from '../../../../shared/enum/search-request-workflow-stages.enum';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {ExtractRequestWorkflowStages} from '../../../../shared/enum/extract-request-workflow-stages.enum';
import {SearchRequest} from '../../../../shared/dto/search-request.model';
import {Element} from '../../search-document/search-document-view/search-document-view.component';
import {ExtractRequest} from '../../../../shared/dto/extract-request.model';
import {HttpErrorResponse} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {PaymentResponse} from '../../../../shared/dto/payment-response.model';
import {PaymentStatus} from '../../../../shared/enum/payment-status.enum';
import {SessionService} from '../../../../shared/service/session.service';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {ExtractRequestService} from '../../../../shared/service/extract-request.service';
import {SearchDocumentApplicationComponent} from '../../search-document/search-document-view/search-document-application/search-document-application.component';
import {ExtractApplicationComponent} from './extract-application/extract-application.component';

@Component({
  selector: 'app-extract-view',
  templateUrl: './extract-view.component.html',
  styleUrls: ['./extract-view.component.css']
})
export class ExtractViewComponent implements OnInit {

  @ViewChild(ExtractApplicationComponent, {static: false}) extractApplicationComponent: ExtractApplicationComponent;


  public workflow: string = Workflow.EXTRACT_REQUEST;
  public workflowStage: any;
  public requestId: any;
  public action: any;

  ActionMode = ActionMode;
  ExtractWorkflowStages = ExtractRequestWorkflowStages;

  public folioList: Element[] = [];
  public paymentList: number[] = [];

  public extractRequest = new ExtractRequest();

  constructor(private location: Location,
              private snackBarService: SnackBarService,
              private sessionService: SessionService,
              private extractRequestService: ExtractRequestService,
              private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.workflowStage = atob(params['workflow']);
      this.requestId = atob(params['id']);
    });
  }

  ngOnInit() {
    this.action = this.workflowStage != ExtractRequestWorkflowStages.EXTRACT_REQ_RETURN_BY_ARL ? ActionMode.VIEW : ActionMode.UPDATE;
  }

  goBack(): any {
    this.location.back();
    return false;
  }

  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentStatusCode != PaymentStatus.PAYMENT_FAILED) {
      this.paymentList.push(data.paymentId);
    } else {
      this.snackBarService.error('Oh no, Your payment failed.')
    }
  }

  onChangeFolioItem(data: Element) {
    if (data.index == 0 && data.deleted) {
      this.folioList.forEach((item, index) => {
        if (item === data) this.folioList.splice(index, 1);
      });
    } else {
      this.folioList.push(data);
    }
  }

  onChangeFormData(data: FormGroup) {

  }

  onClickSaveChanges() {
    let isValid = true;
    let errorMassage = '';

    if (this.extractApplicationComponent.canApply) {
      isValid = false;
      errorMassage = 'Please apply changes, before click save changes.';
    }
    //
    // if (isValid && this.extractApplicationComponent.elements.length == 0) {
    //   isValid = false;
    //   errorMassage = 'Please add one or more folio, before continue.';
    // }
    //
    // if (isValid) {
    //   this.extractRequest = this.extractApplicationComponent.searchRequestForm.value;
    //   this.extractRequest.requestId = this.requestId;
    //   this.extractRequest.workflowStageCode = SearchRequestWorkflowStages.SEARCH_REQ_MODIFIED;
    //   this.extractRequest.folioList = this.folioList;
    //   this.extractRequest.paymentList = this.paymentList;
    //   this.extractRequest.userId = this.sessionService.getUser().id;
    //   this.extractRequest.userType = this.sessionService.getUser().type;
    //   this.updateRequest(this.extractRequest);
    // } else {
    //   this.snackBarService.error(errorMassage);
    // }
    if (isValid) {
      this.actionUpdate(ExtractRequestWorkflowStages.EXTRACT_REQ_MODIFIED);
    } else {
      this.snackBarService.error(errorMassage);
    }
  }

  updateRequest(extractRequest: ExtractRequest): void {
    this.extractRequestService.updateSearchRequest(extractRequest).subscribe(
      (data) => {
        if (data) {
          this.snackBarService.success('Your Extract request is updated.')
          this.goBack();
        } else {
          this.snackBarService.warn('Please try again.')
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.snackBarService.error(error.message);
      }, () => {
      }
    );
  }

  actionUpdate(workflowStage: string): void {

    let searchRequestAction = new SearchRequest();
    searchRequestAction.workflowStageCode = workflowStage;
    searchRequestAction.requestId = this.requestId;

    this.extractRequestService.action(searchRequestAction).subscribe(
      (data) => {
        if (data != null) {
          this.snackBarService.success('Successfully submitted');
          this.goBack();
        }
      }
    );
  }

}

export interface Element {
  index: number;
  folioNo: string;
  noOfYears: string;
  deleted: boolean;
  status: string;
}
