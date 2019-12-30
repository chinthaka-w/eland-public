import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Notary} from "../../../shared/dto/notary.model";
import {NotaryService} from "../../../shared/service/notary-service";
import {NotaryApplicationComponent} from "./notary-application/notary-application.component";
import {Workflow} from '../../../shared/enum/workflow.enum';
import {DocumentResponseDto} from "../../../shared/dto/document-response.dto";
import {SupportingDocDetailComponent} from "./supporting-doc-detail/supporting-doc-detail.component";
import {LoginComponent} from "../../login/login.component";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestSearchDetailDTO} from "../../../shared/dto/request-search.dto";
import {PaymentResponse} from "../../../shared/dto/payment-response.model";
import {SnackBarService} from "../../../shared/service/snack-bar.service";
import {SupportDocResponseModel} from "../../../shared/dto/support-doc-response.model";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-view-notary',
  templateUrl: './view-notary.component.html',
  styleUrls: ['./view-notary.component.css']
})
export class ViewNotaryComponent implements OnInit {
  Workflow: Workflow;
  public workflow: string;
  public id: number;
  @Input() notaryId: number;
  @ViewChild(NotaryApplicationComponent, {static: false}) notaryApplicationComponent: NotaryApplicationComponent;
  @ViewChild(SupportingDocDetailComponent,{static: false}) supportingDocumentDetails: SupportingDocDetailComponent;
  public disabled: boolean = false;
  public disabledPayment: boolean = true;
  public disabledRemark: boolean = true;
  public disabledDocuments: boolean = true;
  public docsList: DocumentResponseDto[] = [];
  public docTypeId: number;
  public docId: number;
  public notary: Notary;
  public isApplicationValid: boolean = true;
  public selectedIndex: number = 0;
  public requestId: RequestSearchDetailDTO;
  public workFlowStage: string;

  constructor(private newNotaryService: NotaryService,
              private route: ActivatedRoute,
              private snackBar: SnackBarService,
              private router: Router) {
    this.route.params.subscribe(params => {
      // this.workflow  = atob(params['workflow']);
      // this.requestId  = atob(params['id']);
      // this.id = +this.requestId;
    });

  }
  ngOnInit() {
    this.getRequestDetails();
  }

  getRequestDetails(){
    this.newNotaryService.getNotaryRequestDetails(this.notaryId).subscribe(
      (data: RequestSearchDetailDTO) =>{
        this.requestId = data;
        this.workFlowStage = data.workflow;
      }
    )
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent,event): void {
    this.selectedIndex = tabChangeEvent.index;
    if( event.tab.textLabel === "Application" ){
      this.disabledPayment = true;
      this.disabledRemark = true;
      this.disabledDocuments = true;
    }
    if((event.tab.textLabel === "Payment Info") && (!this.isApplicationValid)){
      this.disabledPayment = false;
      this.disabledRemark = false;
      this.disabledDocuments = false;
    }
    if(event.tab.textLabel === "Remark"){
      this.disabledPayment = false;
      this.disabledRemark = false;
      this.disabledDocuments = false;
    }
    if(event.tab.textLabel === "Supporting Documents"){
      this.disabled = true;
      this.disabledPayment = false;
      this.disabledRemark = false;
      this.disabledDocuments = false;
    }
  }


  getSupportingDocs(data: DocumentResponseDto[]){
    this.docsList = data;
  }

  getApplicationDetails(data: Notary){
    this.isApplicationValid = false;
    this.notary = data;
    this.selectedIndex += 1;
  }

  onFormSubmit(){
    this.updateNotaryDetails(this.notary);
    this.updateDocumentDetails(this.docsList);
  }

  updateDocumentDetails(documents: DocumentResponseDto[]){
    documents.forEach(value => {
      this.docTypeId = value.docTypeId;
      this.docId = value.docId;

      const formData = new FormData();
      const supportDocResponse = new SupportDocResponseModel(this.docId,this.docTypeId,this.requestId.requestId);
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

  updateNotaryDetails(notaryDetails: Notary){
      this.newNotaryService.updateNotaryDetails(notaryDetails).subscribe(
        (success: string) => {
          this.snackBar.success('Notary Registration Success');
        },
        error => {
          this.snackBar.error('Failed');
        }
      );
    }
}
