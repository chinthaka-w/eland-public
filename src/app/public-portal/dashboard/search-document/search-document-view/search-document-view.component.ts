import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {ActivatedRoute} from '@angular/router';
import {ActionMode} from '../../../../shared/enum/action-mode.enum';
import {SearchRequestWorkflowStages} from '../../../../shared/enum/search-request-workflow-stages.enum';
import {PaymentResponse} from '../../../../shared/dto/payment-response.model';
import {PaymentStatus} from '../../../../shared/enum/payment-status.enum';
import {FormGroup} from '@angular/forms';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {SearchRequestType} from '../../../../shared/enum/search-request-type.enum';
import {WorkflowStages} from '../../../../shared/enum/workflow-stages.enum';
import {NotaryApplicationComponent} from '../../view-notary/notary-application/notary-application.component';
import {SearchDocumentApplicationComponent} from './search-document-application/search-document-application.component';
import {SearchRequest} from '../../../../shared/dto/search-request.model';
import {SessionService} from '../../../../shared/service/session.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SearchRequestService} from '../../../../shared/service/search-request.service';

@Component({
  selector: 'app-search-document-view',
  templateUrl: './search-document-view.component.html',
  styleUrls: ['./search-document-view.component.css']
})
export class SearchDocumentViewComponent implements OnInit {

  @ViewChild(SearchDocumentApplicationComponent, {static: false}) searchDocumentApplicationComponent: SearchDocumentApplicationComponent;


  public workflow: string = Workflow.SEARCH_REQUEST;
  public workflowStage: any;
  public requestId: any;
  public action: any;

  public selectedIndex = 0;

  ActionMode = ActionMode;
  SearchWorkflowStages = SearchRequestWorkflowStages;

  public folioList: Element[] = [];
  public paymentList: number[] = [];

  public searchRequest = new SearchRequest();

  constructor(private location: Location,
              private snackBarService: SnackBarService,
              private sessionService: SessionService,
              private searchRequestService: SearchRequestService,
              private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.workflowStage = atob(params['workflow']);
      this.requestId = atob(params['id']);
    });
  }

  ngOnInit() {
    this.action = this.workflowStage != SearchRequestWorkflowStages.SEARCH_REQ_RETURN_BY_ARL ? ActionMode.VIEW : ActionMode.UPDATE;
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

    // if (!this.searchDocumentApplicationComponent.searchRequestForm.valid) {
    //   isValid = false;
    //   errorMassage = 'Please fill application form, before continue.';
    // }
    //
    // if (isValid && this.searchDocumentApplicationComponent.elements.length == 0) {
    //   isValid = false;
    //   errorMassage = 'Please add one or more folio, before continue.';
    // }
    //
    // if (isValid) {
    //   this.searchRequest = this.searchDocumentApplicationComponent.searchRequestForm.value;
    //   this.searchRequest.requestId = this.requestId;
    //   this.searchRequest.workflowStageCode = SearchRequestWorkflowStages.SEARCH_REQ_MODIFIED;
    //   // this.searchRequest.folioList = this.folioList;
    //   // this.searchRequest.paymentList = this.paymentList;
    //   this.searchRequest.userId = this.sessionService.getUser().id;
    //   this.searchRequest.userType = this.sessionService.getUser().type;
    //   this.updateRequest(this.searchRequest);
    // } else {
    //   this.snackBarService.error(errorMassage);
    // }

    this.actionUpdate(SearchRequestWorkflowStages.SEARCH_REQ_MODIFIED);
  }

  updateRequest(searchRequest: SearchRequest): void {
    this.searchRequestService.updateSearchRequest(searchRequest).subscribe(
      (data) => {
        if (data) {
          this.snackBarService.success('Your Search request is updated.')
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

    this.searchRequestService.action(searchRequestAction).subscribe(
      (data) => {
        if (data != null) {
          this.snackBarService.success('Successfully submitted');
          this.goBack();
        }
      }
    );
  }

  getSelectedIndex(val: number) {
    this.selectedIndex = val;
  }
}

export interface Element {
  index: number;
  folioNo: string;
  noOfYears: string;
  deleted: boolean;
  status: string;
}
