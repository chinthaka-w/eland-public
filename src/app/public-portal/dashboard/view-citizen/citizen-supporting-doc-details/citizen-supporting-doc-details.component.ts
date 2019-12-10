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
  }

  ngOnInit() {
    this.citizenService.citizenDto.subscribe((result) => {
      this.supportingDocuments = result.supportingDocuments;
    });
    this.getDocumentPreview();
    this.supportingDocForm = new FormGroup({
      remarks: new FormArray([])
    });
  }

  getDocumentPreview(): void{
    this.notaryService.loadDocImages.subscribe(
      (result:string[])=> {
        this.documentImages = result;
      }
    );
  }

  getSupportingDocDetails(data: DocumentResponseDto[]){
    console.log(data);
  }

}
