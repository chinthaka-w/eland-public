import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NewNotarySupportingDocDetailDto} from "../../../../../shared/dto/new-notary-supporting-doc-detail.dto";
import {ApplicationRequestDataType} from "../../../../../shared/enum/application-request-data-type.enum";
import {FormArray, FormGroup} from "@angular/forms";
import {NewNotaryRequestsCategorySearchDto} from "../../../../../shared/dto/new-notary-requests-category-search.dto";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NewNotaryDataVarificationService} from "../../../../../shared/service/new-notary-data-varification.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource} from "@angular/material/table";
import {DocumentDto} from "../../../../../shared/dto/document-list";
import {WorkflowStageDocDto} from "../../../../../shared/dto/workflow-stage-doc.dto";
import {SupportDocResponseModel} from "../../../../../shared/dto/support-doc-response.model";
import {NotaryService} from "../../../../../shared/service/notary-service";
import {DocTypeDto} from "../../../../../shared/dto/doc-type.dto";
import {Workflow} from "../../../../../shared/enum/workflow.enum";
import {SupportingDocService} from "../../../../../shared/service/supporting-doc.service";
import {PaymentResponse} from "../../../../../shared/dto/payment-response.model";
import {DocumentResponseDto} from "../../../../../shared/dto/document-response.dto";

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.css']
})
export class DocumentTableComponent implements OnInit {
  @Input()
  files: File[] = [];
  @Output() response = new EventEmitter<DocumentResponseDto[]>();

  documentImages: string[] = [];
  item1: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  public docList: WorkflowStageDocDto[];
  supportingDocuments: NewNotarySupportingDocDetailDto[] = [];
  supportingDocForm: FormGroup;
  displayedColumns: string[] = ['Document Name', 'Remark'];
  public documentList: DocumentDto[] = [];
  public docsList: DocumentResponseDto[] = [];
  dataSource = new MatTableDataSource<NewNotarySupportingDocDetailDto>(this.supportingDocuments);

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private notaryService: NewNotaryDataVarificationService,
              private newNotaryService: NotaryService,
              private documetService: SupportingDocService) {
    this.item1.id =1;
    this.item1.name = 'name1';
    this.item1.statusCode = false;

    this.supportingDocuments.push(this.item1);
  }

  ngOnInit() {
    this.getDocumentDetails();
    this.supportingDocForm = new FormGroup({
      remarks: new FormArray([])
    });
    this.getDocumentTypes();
    this.getDocumentPreview();
  }

  getDocumentPreview(): void{
    this.notaryService.loadDocImages.subscribe(
      (result:string[])=> {
        console.log(result);
        this.documentImages = result;
      }
    );
  }

  getDocumentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(1,"1",null);
    // this.route.paramMap.subscribe(params => {
    //   searchType.requestID = params.get('id')
    // });
    searchType.type = ApplicationRequestDataType.SUPPORTING_DOC;

    this.notaryService.getDocumentDetails(searchType).subscribe(
      (result: NewNotarySupportingDocDetailDto[]) => {
        this.supportingDocuments = result;
        this.dataSource.data = this.supportingDocuments;
        console.log('Documents...'+this.supportingDocuments);
        this.notaryService.loadDocImages.emit(result[0].document);
      },
      error1 => console.log(error1)
    );
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.docsList.push(new DocumentResponseDto(0,docTyprId,this.files[0],""));
    this.saveNewDocuments(docTyprId,this.docsList);
    console.log(this.docsList);
    this.response.emit(this.docsList);
  }

  saveNewDocuments(docTypeId: number,docs: DocumentResponseDto[]){
    let requestId = 1;
    const formData = new FormData();
    const supportDocResponse = new SupportDocResponseModel(docTypeId,requestId);
    formData.append('data', JSON.stringify(supportDocResponse));
    docs.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.docTypeId);
    });
    this.newNotaryService.updateSupportDocuments(formData).subscribe(
      (res) =>{
        console.log(res);
      }
    )
  }

  getDocumentTypes(){
    this.documetService.getDocumentsByWorkFlow(Workflow.NOTARY_REGISTRATION).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
        console.log(this.docList)
      }
    );
  }
}
