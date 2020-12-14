import { SystemService } from './../../../../shared/service/system.service';
import { Parameters } from './../../../../shared/enum/parameters.enum';
import { CommonStatus } from './../../../../shared/enum/common-status.enum';
import { RequestResponse } from './../../../../shared/dto/request-response.model';
import { NewNotaryDataVarificationService } from './../../../../shared/service/new-notary-data-varification.service';
import { NewNotaryPaymentDto } from './../../../../shared/dto/new-notary-payment.dto';
import { PaymentDto } from './../../../../shared/dto/payment-dto';
import { PaymentResponse } from './../../../../shared/dto/payment-response.model';
import { Workflow } from './../../../../shared/enum/workflow.enum';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {JudicialChangeWorkflowStagesEnum} from '../../../../shared/enum/judicial-change-workflow-stages.enum';
import {WorkflowStages} from '../../../../shared/enum/workflow-stages.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {LandRegistryModel} from '../../../../shared/dto/land-registry.model.';
import {JudicialZoneService} from '../../../../shared/service/judicial-zone.service';
import {JudicialChange} from '../../../../shared/dto/judicial-change-model';
import {JudicialService} from '../../../../shared/service/change-judicial-service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SupportingDocDetailComponent} from '../../view-notary/supporting-doc-detail/supporting-doc-detail.component';
import {NotaryApplicationComponent} from '../../view-notary/notary-application/notary-application.component';
import {RequestSearchDetailDTO} from '../../../../shared/dto/request-search.dto';
import {NotaryService} from '../../../../shared/service/notary-service';
import {DocumentResponseDto} from '../../../../shared/dto/document-response.dto';
import {Notary} from '../../../../shared/dto/notary.model';
import {SupportDocResponseModel} from '../../../../shared/dto/support-doc-response.model';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';

@Component({
  selector: 'app-judicial-change-request-view',
  templateUrl: './judicial-change-request-view.component.html',
  styleUrls: ['./judicial-change-request-view.component.css']
})
export class JudicialChangeRequestViewComponent implements OnInit {
  requestId: string;
  WorkflowCode = WorkflowStages;
  id: number;
  workflow: string;
  public selectedIndex: number = 0;
  public disabled: boolean = true;
  public disabledPayment: boolean = true;
  public disabledRemark: boolean = true;
  public disabledDocuments: boolean = true;
  public isApplicationValid: boolean = true;
  @ViewChild(NotaryApplicationComponent, {static: false}) notaryApplicationComponent: NotaryApplicationComponent;
  @ViewChild(SupportingDocDetailComponent,{static: false}) supportingDocumentDetails: SupportingDocDetailComponent;
  public workFlowStage: string;
  public docsList: DocumentResponseDto[] = [];
  public judicialChange: JudicialChange;
  @Input() notaryId: number;
  public docTypeId: number;
  public docId: number;
  public judicial: JudicialChange;
  public enableFormEdit = false;
  public workflowCode = Workflow.JUDICIAL_ZONE_CHANGE;
  showSpinner = false;
  paymentParameter = Parameters.JUDICIAL_CHANGE_FEE;
  requestDetailPayment = new RequestSearchDetailDTO(null, null,null,null,null, null, null, null, null, null, null);

  constructor(private route: ActivatedRoute,
              private newNotaryService: NotaryService,
              private snackBar: SnackBarService,
              private judicialService: JudicialService,
              private router: Router,
              private newNotaryDataVerificationService: NewNotaryDataVarificationService,
              private systemService: SystemService) {
    this.route.params.subscribe(params => {
      this.workflow  = atob(params['workflow']);
      this.requestId  = atob(params['id']);
      this.requestDetailPayment.requestId = +this.requestId;
      this.requestDetailPayment.workflow = this.workflowCode;
      this.requestDetailPayment.workflowStage = JudicialChangeWorkflowStagesEnum.DATA_VERIFICATION_CLERK_REJECTED;
      this.id = +this.requestId;
    });

   }

  ngOnInit() {
    if (this.workflow === JudicialChangeWorkflowStagesEnum.DATA_VERIFICATION_CLERK_REJECTED) {
      this.enableFormEdit = true;
    }
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


  getApplicationDetails(data: JudicialChange){
    this.judicial = data;
    this.updateDetails();
  }

  getJudicialChangeDetails(data: JudicialChange){
    this.isApplicationValid = false;
    this.judicialChange = data;
    this.selectedIndex += 1;
  }

  onFormSubmit(){
    const judicialData = new JudicialChange();
    judicialData.requestId = this.id;
    judicialData.workflowCode = JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_MODIFIED;

    this.judicialService.setUserAction(judicialData).subscribe(
      (response: RequestResponse) => {
        if  (response.status === CommonStatus.SUCCESS) {
          this.snackBar.success('Successfully updated');
          this.router.navigate(['/requests', this.getBase64Url(this.workflowCode)]);
        }
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
    this.judicialService.update(this.judicial).subscribe(
      (success: string) => {
        this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.UPDATE_SUCCESS'));
        this.showSpinner = false;
      },
      error => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.SERVER_ERROR'));
        this.showSpinner = false;
      }
    );
  }

  getBase64Url(url: string): string {
    return btoa(url);
  }
}
