import { SnackBarService } from './../../../../shared/service/snack-bar.service';
import { CommonStatus } from './../../../../shared/enum/common-status.enum';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NewNotaryDataVarificationService} from '../../../../shared/service/new-notary-data-varification.service';
import {DocumentResponseDto} from '../../../../shared/dto/document-response.dto';
import {NewNotarySupportingDocDetailDto} from '../../../../shared/dto/new-notary-supporting-doc-detail.dto';
import {WorkflowStageDocDto} from '../../../../shared/dto/workflow-stage-doc.dto';
import {FormArray, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NotaryService} from '../../../../shared/service/notary-service';
import {SupportingDocService} from '../../../../shared/service/supporting-doc.service';
import {NewNotaryRequestsCategorySearchDto} from '../../../../shared/dto/new-notary-requests-category-search.dto';
import {RequestSearchDetailDTO} from '../../../../shared/dto/request-search.dto';
import { SupportDocResponseModel } from 'src/app/shared/dto/support-doc-response.model';

@Component({
  selector: 'app-supporting-doc-detail',
  templateUrl: './supporting-doc-detail.component.html',
  styleUrls: ['./supporting-doc-detail.component.css']
})
export class SupportingDocDetailComponent implements OnInit {
  @Input()
  files: File[] = [];
  @Input() enableDocUpload = false;
  public requestId: RequestSearchDetailDTO;
  @Input() requestDocuments: RequestSearchDetailDTO;
  @Input() id: number;
  @Input() workflow: string;
  public docsList: DocumentResponseDto[] = [];
  @Output() supportDocs = new EventEmitter<DocumentResponseDto[]>();


  @Input() editable : boolean = false;

  item1: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  supportingDocuments: NewNotarySupportingDocDetailDto[] = [];
  supportingDocForm: FormGroup;
  displayedColumns: string[] = ['Document Name', 'Remark'];
  documentImages: string[] = [];
  public docList: WorkflowStageDocDto[] = [];
  dataSource = new MatTableDataSource<NewNotarySupportingDocDetailDto>(this.supportingDocuments);
  public docTypeId: number;
  public docId: number;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private notaryService: NewNotaryDataVarificationService,
              private newNotaryService: NotaryService,
              private documetService: SupportingDocService,
              private snackBarService: SnackBarService) {
    // this.item1.id =1;
    // this.item1.name = 'name1';
    // this.item1.statusCode = false;
    //
    // this.supportingDocuments.push(this.item1);
  }

  ngOnInit() {
    this.getDocumentPreview();
    this.getDocumentDetails();
    this.supportingDocForm = new FormGroup({
      remarks: new FormArray([])
    });
    this.getDocumentTypesForNotaryNameChange();
    this.getDocumentTypes();
  }

  getDocumentPreview(): void {
    this.notaryService.loadDocImages.subscribe(
      (result: string[]) => {
        this.documentImages = result;
      }
    );
  }

  getDocumentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(
      this.requestDocuments !== undefined ?
        this.requestDocuments.requestId : this.id,
      this.requestDocuments !== undefined ?
        this.requestDocuments.workflow : this.workflow);
    this.notaryService.getDocumentDetails(searchType).subscribe(
      (result: NewNotarySupportingDocDetailDto[]) => {
        if (result != null && result.length != 0) {
          this.supportingDocuments = result;
          this.dataSource.data = this.supportingDocuments;
          this.notaryService.loadDocImages.emit(result[0].document);
        }
      },
      error1 => console.log(error1)
    );
  }

  setFiles(data: any, docTyprId: number, docId: number, status: boolean) {
    const docResponse = new DocumentResponseDto(docId,
      docTyprId,
      data[data.length - 1],
      status ? CommonStatus.REQUIRED : CommonStatus.OPTIONAL);
    if (docResponse.files) {
      this.docsList.push(docResponse);
    } else {
      this.removeDocItem(docResponse.docTypeId);
    }
  }

  removeDocItem(docType: number) {
    this.docsList.forEach((doc, index) => {
      if (doc.docTypeId === docType) {
        this.docsList.splice(index, 1);
      }
    });
  }

  onFormSubmit(docsList: DocumentResponseDto[]) {
    // this.docsList.push(new DocumentResponseDto(this.docId, this.docTypeId, this.files[0], ''));
    this.supportDocs.emit(this.docsList);
    // save notary documents
    if (this.docsList.length > 0) {
      // check mandatory docs validity
      let workflowRequiredDocCount = 0;
      let uploadMandatoryDocCount = 0;

      this.docsList.forEach((doc, index) => {
        if (doc.status === CommonStatus.REQUIRED) {
          uploadMandatoryDocCount += 1;
        }
      });

      this.docList.forEach((doc, index) => {
        if (doc.required) {
          workflowRequiredDocCount += 1;
        }
      });

      if (workflowRequiredDocCount === uploadMandatoryDocCount) {
        const formData = new FormData();
        this.docsList.forEach(doc => {
          formData.append('file', doc.files, doc.files.name + '|' + doc.docTypeId);
        });

        const supportDocResponse = new SupportDocResponseModel(null, null, this.id);
        formData.append('data', JSON.stringify(supportDocResponse));

        this.newNotaryService.updateSupportDocuments(formData).subscribe(
          (response) => {
            this.getDocumentDetails();
          }
        );
      } else {
        this.snackBarService.warn('Plase upload mandatory documennts');
      }

    }
  }


  getDocumentTypes() {
    this.documetService.getDocumentsByWorkFlow(
      this.requestDocuments !== undefined ? this.requestDocuments.workflow : this.workflow).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  getDocumentTypesForNotaryNameChange() {
    this.documetService.getDocumentsByWorkFlow(this.workflow !== undefined ? this.workflow : this.workflow).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }


}
