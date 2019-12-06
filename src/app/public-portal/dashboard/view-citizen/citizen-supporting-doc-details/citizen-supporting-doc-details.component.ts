import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DocumentResponseDto} from "../../../../shared/dto/document-response.dto";
import {NewNotarySupportingDocDetailDto} from "../../../../shared/dto/new-notary-supporting-doc-detail.dto";
import {FormArray, FormGroup} from "@angular/forms";
import {WorkflowStageDocDto} from "../../../../shared/dto/workflow-stage-doc.dto";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {NotaryService} from "../../../../shared/service/notary-service";
import {SupportingDocService} from "../../../../shared/service/supporting-doc.service";
import {CitizenService} from "../../../../shared/service/citizen.service";
import {DocumentDTO} from "../../../../shared/dto/document-dto";

@Component({
  selector: 'app-citizen-supporting-doc-details',
  templateUrl: './citizen-supporting-doc-details.component.html',
  styleUrls: ['./citizen-supporting-doc-details.component.css']
})
export class CitizenSupportingDocDetailsComponent implements OnInit {

  // @Input() files: File[] = [];
  // @Input() requestId: number;
  // @Input() workFlowStage: string;
  // @Output() supportDocs = new EventEmitter<DocumentResponseDto[]>();

  item1: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  supportingDocuments: DocumentDTO[] = [];
  supportingDocForm: FormGroup;
  displayedColumns: string[] = ['Document Name', 'Remark'];
  documentImages: string[] = [];
  public docList: WorkflowStageDocDto[];
  public docsList: DocumentResponseDto[] = [];
  dataSource = new MatTableDataSource<DocumentDTO>(new Array<DocumentDTO>());

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private notaryService: NewNotaryDataVarificationService,
              private newNotaryService: NotaryService,
              private documetService: SupportingDocService,
              private citizenService: CitizenService) {
    this.item1.id =1;
    this.item1.name = 'name1';
    this.item1.statusCode = false;

    // this.supportingDocuments.push(this.item1);
  }

  ngOnInit() {
    this.citizenService.citizenDto.subscribe((result) => {
      this.supportingDocuments = result.supportingDocuments;
    });
    this.getDocumentPreview();
    // this.getDocumentDetails();
    this.supportingDocForm = new FormGroup({
      remarks: new FormArray([])
    });
    // this.getDocumentTypes();
  }

  getDocumentPreview(): void{
    this.notaryService.loadDocImages.subscribe(
      (result:string[])=> {
        this.documentImages = result;
      }
    );
  }

  // getDocumentDetails() {
  //   let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestId,"1","");
  //   // this.route.paramMap.subscribe(params => {
  //   //   searchType.requestID = params.get('id')
  //   // });
  //   searchType.type = ApplicationRequestDataType.SUPPORTING_DOC;
  //
  //   this.notaryService.getDocumentDetails(searchType).subscribe(
  //     (result: NewNotarySupportingDocDetailDto[]) => {
  //       this.supportingDocuments = result;
  //       this.dataSource.data = this.supportingDocuments;
  //       this.notaryService.loadDocImages.emit(result[0].document);
  //     },
  //     error1 => console.log(error1)
  //   );
  // }

  // setFiles(data: any, docTyprId: number,docId: number) {
  //   this.files = data;
  //   this.docsList.push(new DocumentResponseDto(docId,docTyprId,this.files[0],""));
  //   this.supportDocs.emit(this.docsList);
  // }

  // saveNewDocuments(docId: number ,docTypeId: number,docs: DocumentResponseDto[]){
  //   const formData = new FormData();
  //   const supportDocResponse = new SupportDocResponseModel(docId,docTypeId,this.requestId);
  //   formData.append('data', JSON.stringify(supportDocResponse));
  //   docs.forEach(doc => {
  //     formData.append('file', doc.files, doc.files.name + '|' + doc.docTypeId);
  //   });
  //   this.newNotaryService.updateSupportDocuments(formData).subscribe(
  //     (res) =>{
  //       console.log(res);
  //     }
  //   )
  // }

  // getDocumentTypes(){
  //   this.documetService.getDocumentsByWorkFlow(this.workFlowStage).subscribe(
  //     (data: WorkflowStageDocDto[]) => {
  //       this.docList = data;
  //     }
  //   );
  // }

  getSupportingDocDetails(data: DocumentResponseDto[]){
    console.log(data);
  }

}
