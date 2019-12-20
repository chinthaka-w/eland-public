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
import {WorkflowStageDocTypeDTO} from "../../../../shared/dto/workflow-stage-doc-type-dto";
import {CitizenDTO} from "../../../../shared/dto/citizen-dto";
import {WorkflowStageCitizenReg} from "../../../../shared/enum/workflow-stage-citizen-reg.enum";
import {SnackBarService} from "../../../../shared/service/snack-bar.service";

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

  files: File[] = [];
  public docTypeId: number;
  public docId: number;
  supportDocs: DocumentResponseDto[];
  fileList = {};
  workflowStageDocTypes: Array<WorkflowStageDocTypeDTO> = [];
  citizen: CitizenDTO = new CitizenDTO();
  citizenNew: CitizenDTO = new CitizenDTO();
  public workflowStageCitizenReg = WorkflowStageCitizenReg;
  workFlowStage: string;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private notaryService: NewNotaryDataVarificationService,
              private newNotaryService: NotaryService,
              private documetService: SupportingDocService,
              private citizenService: CitizenService,
              private snackBar: SnackBarService,) {
    this.item1.id =1;
    this.item1.name = 'name1';
    this.item1.statusCode = false;
  }

  ngOnInit() {
    this.citizenService.citizenDto.subscribe((result) => {
      this.citizen = result;
      this.supportingDocuments = result.supportingDocuments;
      this.setWorkFlowStageByCitizenType();
      this.citizenService.getRelatedDocTypes(this.workFlowStage)
        .subscribe((res) => {
          this.workflowStageDocTypes = res;
        });
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

  setFiles(files, key){
    this.fileList[key] = files;
  }

  updateCitizenSupportingDocs() {
    this.citizenNew.id = this.citizen.id;
    this.citizenNew.reqId = this.citizen.reqId;
    this.citizenService.updateSupportingDocs(this.fileList, this.citizenNew)
      .subscribe((result) => {
        if (result) {
          this.snackBar.success('Documents updated successfully');
        }else{
          this.snackBar.error('Update Failed');
        }
      });
  }

  onFormSubmit(docsList: DocumentResponseDto[]){
    this.docsList.push(new DocumentResponseDto(this.docId,this.docTypeId,this.files[0],""));
  }

  setWorkFlowStageByCitizenType() {
    if(this.citizen.userType == 1) {
      this.workFlowStage = this.workflowStageCitizenReg.CITIZEN_INIT;
    }
    else if(this.citizen.userType == 2) {
      this.workFlowStage = this.workflowStageCitizenReg.BANK_INIT;
    }
    else if(this.citizen.userType == 3) {
      this.workFlowStage = this.workflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT;
    }
    else if(this.citizen.userType == 4) {
      this.workFlowStage = this.workflowStageCitizenReg.STATE_INSTITUTE_INIT;
    }
    else if(this.citizen.userType == 5) {
      this.workFlowStage = this.workflowStageCitizenReg.OTHER_INSTITUTE_INIT;
    }
  }

}
