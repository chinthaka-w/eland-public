import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {DocumentResponseDto} from "../../../../shared/dto/document-response.dto";
import {NewNotarySupportingDocDetailDto} from "../../../../shared/dto/new-notary-supporting-doc-detail.dto";
import {WorkflowStageDocDto} from "../../../../shared/dto/workflow-stage-doc.dto";
import {FormArray, FormGroup} from "@angular/forms";
import {DocumentDto} from "../../../../shared/dto/document-list";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NotaryService} from "../../../../shared/service/notary-service";
import {SupportingDocService} from "../../../../shared/service/supporting-doc.service";
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";
import {ApplicationRequestDataType} from "../../../../shared/enum/application-request-data-type.enum";
import {SupportDocResponseModel} from "../../../../shared/dto/support-doc-response.model";
import {Workflow} from "../../../../shared/enum/workflow.enum";

@Component({
  selector: 'app-supporting-doc-detail',
  templateUrl: './supporting-doc-detail.component.html',
  styleUrls: ['./supporting-doc-detail.component.css']
})
export class SupportingDocDetailComponent implements OnInit {
  @Input()
  files: File[] = [];
  @Output() supportDocs = new EventEmitter<DocumentResponseDto[]>();
  item1: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  supportingDocuments: NewNotarySupportingDocDetailDto[] = [];
  supportingDocForm: FormGroup;
  displayedColumns: string[] = ['Document Name', 'Remark'];
  documentImages: string[] = [];
  public docList: WorkflowStageDocDto[];
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
    this.getDocumentPreview();
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
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(1,"1");
    // this.route.paramMap.subscribe(params => {
    //   searchType.requestID = params.get('id')
    // });
    searchType.type = ApplicationRequestDataType.SUPPORTING_DOC;

    this.notaryService.getDocumentDetails(searchType).subscribe(
      (result: NewNotarySupportingDocDetailDto[]) => {
        this.supportingDocuments = result;
        this.dataSource.data = this.supportingDocuments;
        this.notaryService.loadDocImages.emit(result[0].document);
      },
      error1 => console.log(error1)
    );
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.docsList.push(new DocumentResponseDto(0,docTyprId,this.files[0],""));
   // this.saveNewDocuments(docTyprId,this.docsList);
    console.log(this.docsList);
    this.supportDocs.emit(this.docsList);
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

  getSupportingDocDetails(data: DocumentResponseDto[]){
    console.log(data);
  }

}
