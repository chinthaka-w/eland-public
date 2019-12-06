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
  public docsList: DocumentResponseDto[] = [];
  public docTypeId: number;
  public docId: number;

  public requestId: RequestSearchDetailDTO;

  constructor(private newNotaryService: NotaryService,
              private route: ActivatedRoute) {
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
    if( event.tab.textLabel === "Application"){
       this.disabled = false;
   //   this.disabledPayment = false;
    }
    if(event.tab.textLabel === "Payment Info"){
        this.disabled = false;
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
    data.forEach(docs => {
      let docId = docs.docId;
      this.docTypeId = docs.docTypeId;
      this.docId = docs.docId;
      let files = docs.files;
      let status = docs.status;
    })
  }

  onFormSubmit(){
    this.notaryApplicationComponent.saveNotaryDetails();
    this.supportingDocumentDetails.saveNewDocuments(this.docId,this.docTypeId,this.docsList);

  }

}
