import { Workflow } from 'src/app/shared/enum/workflow.enum';
import {Component, OnInit} from '@angular/core';
import {WorkflowStages} from '../../../../shared/enum/workflow-stages.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentResponseDto} from '../../../../shared/dto/document-response.dto';
import {RequestSearchDetailDTO} from '../../../../shared/dto/request-search.dto';
import {NotaryService} from '../../../../shared/service/notary-service';
import {SessionService} from '../../../../shared/service/session.service';
import {Notary} from '../../../../shared/dto/notary.model';
import {NotaryNameChangeModel} from '../../../../shared/dto/notary-name-change.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SupportDocResponseModel} from '../../../../shared/dto/support-doc-response.model';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {ChangeNameService} from '../../../../shared/service/change-name.service';
import {NameChangeWorkflowStagesEnum} from '../../../../shared/enum/name-change-workflow-stages.enum';
import {NotaryRequestView} from '../../../../shared/custom-model/notary-request-view.model';
import {NotaryRequestService} from '../../../../shared/service/notary-request.service';

@Component({
  selector: 'app-name-change-request-view',
  templateUrl: './name-change-request-view.component.html',
  styleUrls: ['./name-change-request-view.component.css']
})
export class NameChangeRequestViewComponent implements OnInit {
  public docsList: DocumentResponseDto[] = [];
  public nameChangeDetails: NotaryNameChangeModel;
  requestId: string;
  requestID: RequestSearchDetailDTO;
  WorkflowCode = WorkflowStages;
  id: number;
  workflow: string;
  public notary: Notary;
  public selectedIndex: number = 0;
  public disabled: boolean = true;
  public disabledPayment: boolean = true;
  public disabledRemark: boolean = true;
  public disabledDocuments: boolean = true;
  public isApplicationValid: boolean = true;
  public docTypeId: number;
  public docId: number;
  workflowStageCode;
  editable: boolean = false;
  requestDetailPayment: RequestSearchDetailDTO;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private newNotaryService: NotaryService,
              private sessionService: SessionService,
              private snackBar: SnackBarService,
              private changeNameService: ChangeNameService,
              private notaryRequestService: NotaryRequestService) {
    this.route.params.subscribe(params => {
      this.workflow  = atob(params['workflow']);
      this.requestId  = atob(params['id']);
      this.workflowStageCode = atob(params['workflowStage']);
      this.id = +this.requestId;
    });

    if (this.workflowStageCode === NameChangeWorkflowStagesEnum.NOTARY_NAME_CHANGE_DATA_VERIFICATION_CLERK_REJECTED) {
      this.editable = true;
    }
  }



  ngOnInit() {
    this.getRequestDetails();
    // set payment request details
    this.requestDetailPayment = new RequestSearchDetailDTO(null, this.id, null, null, null, Workflow.NOTARY_NAME_CHANGE, null, null, null);
    this.requestDetailPayment.workflowStage = this.workflowStageCode;
  }

  getRequestDetails(){
    this.newNotaryService.getNotaryRequestDetails(this.sessionService.getUser().id).subscribe(
      (data: RequestSearchDetailDTO) =>{
        this.requestID  = data;
      }
    )
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent,event): void {
    this.selectedIndex = tabChangeEvent.index;
    if( event.tab.textLabel === "Application" ){
      this.disabled = true;
      this.disabledPayment = true;
      this.disabledRemark = true;
      this.disabledDocuments = true;
    }
    if((event.tab.textLabel === "Payment Info") && (!this.isApplicationValid)){
      this.disabled = true;
      this.disabledPayment = false;
      this.disabledRemark = false;
      this.disabledDocuments = false;
    }
    if(event.tab.textLabel === "Remark"){
      this.disabled = true;
      this.disabledPayment = false;
      this.disabledRemark = false;
      this.disabledDocuments = false;
    }
  }



  getApplicationDetails(data: NotaryNameChangeModel){
    this.isApplicationValid = false;
    this.nameChangeDetails = data;
    this.selectedIndex += 1;
  }

  getNewApplicationDetails(data: Notary){
    this.isApplicationValid = false;
    this.notary = data;
    this.selectedIndex += 1;
  }

  getSupportingDocs(data: DocumentResponseDto[]){
    this.docsList = data;
    this.disabled = true;
  }

  onFormSubmit() {
    const notaryRequestView = new NotaryRequestView();
    notaryRequestView.requestId = this.id;
    notaryRequestView.workFlowStageCode = NameChangeWorkflowStagesEnum.NOTARY_NAME_CHANGE_REQUEST_MODIFIED;

    this.notaryRequestService.update(notaryRequestView).subscribe(
      (success: boolean) => {
        if (success) {
          this.snackBar.success('Notary Name Change Request Success');
          this.router.navigateByUrl('/dashboard');
        } else {
          this.snackBar.error('Failed');
        }
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  updateDocumentDetails(documents: DocumentResponseDto[]){
    documents.forEach(value => {
      this.docTypeId = value.docTypeId;
      this.docId = value.docId;

      const formData = new FormData();
      const supportDocResponse = new SupportDocResponseModel(this.docId, this.docTypeId, this.id);
      formData.append('data', JSON.stringify(supportDocResponse));
      documents.forEach(doc => {
        formData.append('file', doc.files, doc.files.name + '|' + doc.docTypeId);
      });
      this.newNotaryService.updateSupportDocuments(formData).subscribe(
        (success: string) => {
          this.snackBar.success('Document Update Success');
        },
        error => {
          this.snackBar.error('Failed');
        }
      )
    });
  }

  updateDetails(){
    this.changeNameService.update(this.nameChangeDetails).subscribe(
      (success: string) => {
        this.snackBar.success('Notary Name Change Request Update Success');
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }


}
