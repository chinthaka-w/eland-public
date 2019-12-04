import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Notary} from "../../../shared/dto/notary.model";
import {NotaryService} from "../../../shared/service/notary-service";
import {NotaryApplicationComponent} from "./notary-application/notary-application.component";
import {DocumentResponseDto} from "../../../shared/dto/document-response.dto";
import {SupportingDocDetailComponent} from "./supporting-doc-detail/supporting-doc-detail.component";

@Component({
  selector: 'app-view-notary',
  templateUrl: './view-notary.component.html',
  styleUrls: ['./view-notary.component.css']
})
export class ViewNotaryComponent implements OnInit {
  @ViewChild(NotaryApplicationComponent, {static: false}) notaryApplicationComponent: NotaryApplicationComponent;
  @ViewChild(SupportingDocDetailComponent,{static: false}) supportingDocumentDetails: SupportingDocDetailComponent;
  public disabled: boolean = true;
  public disabledPayment: boolean = true;
  public notaryDetail: Notary;
  public docsList: DocumentResponseDto[] = [];
  public docTypeId: number;
  public docId: number;


  constructor(private newNotaryService: NotaryService) { }
  ngOnInit() {
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
