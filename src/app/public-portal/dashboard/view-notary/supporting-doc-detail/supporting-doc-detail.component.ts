import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {DocumentResponseDto} from "../../../../shared/dto/document-response.dto";
import {NewNotarySupportingDocDetailDto} from "../../../../shared/dto/new-notary-supporting-doc-detail.dto";
import {WorkflowStageDocDto} from "../../../../shared/dto/workflow-stage-doc.dto";
import {FormArray, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NotaryService} from "../../../../shared/service/notary-service";
import {SupportingDocService} from "../../../../shared/service/supporting-doc.service";
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";
import {RequestSearchDetailDTO} from "../../../../shared/dto/request-search.dto";

@Component({
  selector: 'app-supporting-doc-detail',
  templateUrl: './supporting-doc-detail.component.html',
  styleUrls: ['./supporting-doc-detail.component.css']
})
export class SupportingDocDetailComponent implements OnInit {
  @Input()
  files: File[] = [];
  public requestId: RequestSearchDetailDTO;
  @Input() requestDocuments: RequestSearchDetailDTO;
  @Input() id: number;
  @Input() workflow: string;
  public docsList: DocumentResponseDto[] = [];
  @Output() supportDocs = new EventEmitter<DocumentResponseDto[]>();

  item1: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  supportingDocuments: NewNotarySupportingDocDetailDto[] = [];
  supportingDocForm: FormGroup;
  displayedColumns: string[] = ['Document Name', 'Remark'];
  documentImages: string[] = [];
  public docList: WorkflowStageDocDto[];
  dataSource = new MatTableDataSource<NewNotarySupportingDocDetailDto>(this.supportingDocuments);
  public docTypeId: number;
  public docId: number;

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
  }

  getDocumentPreview(): void{
    this.notaryService.loadDocImages.subscribe(
      (result:string[])=> {
        this.documentImages = result;
      }
    );
  }

  getDocumentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestDocuments !== undefined ?
      this.requestDocuments.requestId : this.id, this.requestDocuments !== undefined ? this.requestDocuments.workflow : this.workflow);
    this.notaryService.getDocumentDetails(searchType).subscribe(
      (result: NewNotarySupportingDocDetailDto[]) => {
        this.supportingDocuments = result;
        this.dataSource.data = this.supportingDocuments;
        this.notaryService.loadDocImages.emit(result[0].document);
      },
      error1 => console.log(error1)
    );
  }

  setFiles(data: any, docTyprId: number,docId: number) {
    this.files = data;
    this.docTypeId = docTyprId;
    this.docId = docId;
  }

  onFormSubmit(docsList: DocumentResponseDto[]){
    this.docsList.push(new DocumentResponseDto(this.docId,this.docTypeId,this.files[0],""));
    this.supportDocs.emit(this.docsList);
  }


  getDocumentTypes(){
    this.documetService.getDocumentsByWorkFlow(this.requestDocuments !== undefined ? this.requestDocuments.workflow : this.workflow).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }


}
