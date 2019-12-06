import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Notary} from "../../../shared/dto/notary.model";
import {NotaryService} from "../../../shared/service/notary-service";
import {NotaryApplicationComponent} from "./notary-application/notary-application.component";
import {Workflow} from '../../../shared/enum/workflow.enum';
import {DocumentResponseDto} from "../../../shared/dto/document-response.dto";
import {SupportingDocDetailComponent} from "./supporting-doc-detail/supporting-doc-detail.component";
import {LoginComponent} from "../../login/login.component";
import {ActivatedRoute} from "@angular/router";
import {RequestSearchDetailDTO} from "../../../shared/dto/request-search.dto";
import {PaymentResponse} from "../../../shared/dto/payment-response.model";
import {SnackBarService} from "../../../shared/service/snack-bar.service";
import {SupportDocResponseModel} from "../../../shared/dto/support-doc-response.model";

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
  public disabled: boolean = true;
  public disabledPayment: boolean = true;
  public docsList: DocumentResponseDto[] = [];
  public docTypeId: number;
  public docId: number;
  public notary: Notary;

  public requestId: RequestSearchDetailDTO;

  constructor(private newNotaryService: NotaryService,
              private route: ActivatedRoute,
              private snackBar: SnackBarService,) {
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
      }
    )
  }

  tabClick(event){
    if( event.tab.textLabel === "Application" && (!this.notaryApplicationComponent.notaryForm.valid)){
       this.disabled = false;
      this.disabledPayment = false;
    }
    if(event.tab.textLabel === "Payment Info"){
        this.disabled = false;
        this.disabledPayment = true;
    }
    if(event.tab.textLabel === "Remark"){
       this.disabled = false;
    }
    if( event.tab.textLabel === "Supporting Documents"){
      this.disabled = true;
    }
  }

  getSupportingDocs(data: DocumentResponseDto[]){
    this.docsList = data;
  }

  getApplicationDetails(data: Notary){
    this.notary = data;
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
