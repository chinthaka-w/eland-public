import {Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CorrectionRequestService } from 'src/app/shared/service/correction-request.service';
import { LandRegistryModel } from 'src/app/shared/dto/land-registry.model.';
import { JudicialZoneModel } from 'src/app/shared/dto/judicial-zone.model';
import { correctionReq } from 'src/app/shared/dto/correctionReq.model';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition
} from '@angular/material/snack-bar';
import {RequestForCorrectionService} from "../../../shared/service/request-for-correction.service";
import {FolioStatus} from "../../../shared/dto/folio-status.model";
import {DocumentDto} from "../../../shared/dto/document-list";
import {WorkflowStageDocDto} from "../../../shared/dto/workflow-stage-doc.dto";
import {Workflow} from "../../../shared/enum/workflow.enum";
import {SupportingDocService} from "../../../shared/service/supporting-doc.service";
import {FolioCorrectionModel} from "../../../shared/dto/folio-correction.model";
@Component({
  selector: 'app-request-for-correction',
  templateUrl: './request-for-correction.component.html',
  styleUrls: ['./request-for-correction.component.css']
})
export class RequestForCorrectionComponent implements OnInit {
  @Input()
  files: File[] = [];
  public reqForCorrectionForm: FormGroup;
  public correctioReq: JudicialZoneModel[];
  public landReg: LandRegistryModel[];
  public correctionReqDetails: correctionReq;
  submitted = false;
  selected: any[];
  uploadSuccess: boolean;
  newRow : number[ ] = [ ];
  judicialzone: any;
  landRegs: any;
  message: string = 'Successfully Added';
  actionButtonLabel: string = 'Retry';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 2000;
  horizontalPosition: 'right';
  verticalPosition: 'bottom';
  panelClass: 'snackbar-success';
  public documentList: DocumentDto[] = [];
  public docList: WorkflowStageDocDto[];
  public folioCorection: FolioCorrectionModel;
  public folioNumbers: string[] = [];

  constructor(private correctionRequestService: CorrectionRequestService,private snackBar: MatSnackBar,
              private requestForCorrectionService: RequestForCorrectionService,
              private documetService: SupportingDocService) { }
  open() {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    this.snackBar.open(this.message, this.action ? this.actionButtonLabel : undefined, config);
  }
  ngOnInit() {
    this.reqForCorrectionForm = new FormGroup({
      requestedCorrection: new FormControl('', [Validators.required]),
      notaryName: new FormControl('', [Validators.required]),
      landRegId:new FormControl('', [Validators.required]),
      judicialZoneId:new FormControl('', [Validators.required]),
      folioNumbers:new FormControl('', [Validators.required]),
      deedNo: new FormControl('', [Validators.required]),
      attestedDate: new FormControl(new Date(), [Validators.required]),
      natureOfTheCorrection: new FormControl(''),
      citizenId:new FormControl('1'),
      workflowStageCode:new FormControl('status'),
      remark:new FormControl('test remark'),
    });
    this.getjudicialZone();
    this.getLandRegistries();
    this.getAllCorrectionsToBeMade();
    this.getDocumentList();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.reqForCorrectionForm.controls[controlName].hasError(errorName);
  }

  private getjudicialZone(): void {
    this.correctionRequestService.getAllJudicialZones().subscribe(res => {
      this.judicialzone = res;
    });
  }

  private getLandRegistries(): void {
    this.correctionRequestService.getLandRegistries().subscribe(res => {
      this.landRegs = res;
    });
  }

  private getAllCorrectionsToBeMade(): void {
    this.correctionRequestService.getLandRegistries().subscribe(res => {
      this.landRegs = res;
    });
  }

  onFormSubmit() {
    const folioNumbers =  this.reqForCorrectionForm.value.folioNumbers;
    this.folioNumbers.push(folioNumbers);

    this.folioCorection = new FolioCorrectionModel(this.reqForCorrectionForm.value.landRegId,this.reqForCorrectionForm.value.deedNo,
      this.reqForCorrectionForm.value.attestedDate,this.reqForCorrectionForm.value.notaryName,
      this.folioNumbers,this.reqForCorrectionForm.value.natureOfTheCorrection,this.reqForCorrectionForm.value.requestedCorrection,
      this.reqForCorrectionForm.value.judicialZoneId,"",1,"","1","","","",
      new Date(),"",new Date());

    console.log(this.folioCorection);
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.folioCorection));
    console.log(formData);
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.correctionRequestService.saveCorrectionReq(formData)
      .subscribe( res => {
        console.log("result ",res);
        this.open();
      });
  }

  onClickRow(){
    this.newRow.push(this.reqForCorrectionForm.value.folioNumbers);
    console.log( this.reqForCorrectionForm.value.folioNumbers);
    console.log(this.newRow);
  }

  searchFolioNo(folioNo: string){
    folioNo = this.reqForCorrectionForm.value.folioNumbers;
    this.requestForCorrectionService.getCurrentRequestNoStatus(folioNo).subscribe(
      (result:FolioStatus) =>{
        console.log(result);
      }
    )
  }


  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }

  private getDocumentList(): void {
    this.documetService.getDocuments(Workflow.FOLIO_REQUEST_CORRECTION).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }
}
