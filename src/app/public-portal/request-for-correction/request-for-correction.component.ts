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
import {RequestForCorrectionService} from "../../shared/service/request-for-correction.service";
import {FolioStatus} from "../../shared/dto/folio-status.model";
import {DocumentDto} from "../../shared/dto/document-list";
import {WorkflowStageDocDto} from "../../shared/dto/workflow-stage-doc.dto";
import {Workflow} from "../../shared/enum/workflow.enum";
import {SupportingDocService} from "../../shared/service/supporting-doc.service";
import {FolioCorrectionModel} from "../../shared/dto/folio-correction.model";
import {SessionService} from "../../shared/service/session.service";
import {UserType} from "../../shared/enum/user-type.enum";
import {LandRegistryService} from "../../shared/service/land-registry.service";
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
  public landRegistry: LandRegistryModel[];
  public correctionReqDetails: correctionReq;
  submitted = false;
  selected: any[];
  uploadSuccess: boolean;
  newRow : string[ ] = [ ];
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
  public citizenId: number;
  public newNotaryId: number;
  public disabled: boolean =  true;
  public disabled1: boolean = false;

  constructor(private correctionRequestService: CorrectionRequestService,private snackBar: MatSnackBar,
              private requestForCorrectionService: RequestForCorrectionService,
              private documetService: SupportingDocService,
              private sessionService: SessionService,
              private landRegistryService: LandRegistryService) { }
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
      natureOfTheCorrection: new FormControl('',[Validators.required]),
      citizenId:new FormControl('',[Validators.required]),
      workflowStageCode:new FormControl('',[Validators.required]),
      remark:new FormControl('',[Validators.required]),
      recaptcha: new FormControl(null, Validators.required),
      landRegistry: new FormControl('', [Validators.required]),
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
    this.landRegistryService.getAllLandRegistry().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  private getAllCorrectionsToBeMade(): void {
    this.correctionRequestService.getLandRegistries().subscribe(res => {
      this.landRegs = res;
    });
  }

  onFormSubmit() {
    if(this.reqForCorrectionForm.valid){
      this.disabled1 = false;
    }
    if(this.sessionService.getUser().type == UserType.CITIZEN){
      this.citizenId = this.sessionService.getUser().id;
    }
    if(this.sessionService.getUser().type == UserType.NOTARY){
      this.newNotaryId = this.sessionService.getUser().id;
    }

    const folioNumbers =  this.reqForCorrectionForm.value.folioNumbers;
    this.folioNumbers.push(folioNumbers);

    this.folioCorection = new FolioCorrectionModel(this.reqForCorrectionForm.value.landRegId,this.reqForCorrectionForm.value.deedNo,
      this.reqForCorrectionForm.value.attestedDate,this.reqForCorrectionForm.value.notaryName,
      this.folioNumbers,this.reqForCorrectionForm.value.natureOfTheCorrection,this.reqForCorrectionForm.value.requestedCorrection,
      this.reqForCorrectionForm.value.judicialZoneId,"",this.citizenId,"",this.newNotaryId,"","","",
      new Date(),"",new Date());

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.folioCorection));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.correctionRequestService.saveCorrectionReq(formData)
      .subscribe( res => {
        this.open();
      });
  }

  onClickRow(folioNo: string){
    folioNo = this.reqForCorrectionForm.value.folioNumbers;
    this.newRow.push(folioNo);
  }

  searchFolioNo(folioNo: string){
    folioNo = this.reqForCorrectionForm.value.folioNumbers;
    let base64 = this.getBase64(this.reqForCorrectionForm.value.landRegistry+"/"+folioNo);
    this.requestForCorrectionService.getCurrentRequestNoStatus(base64).subscribe(
      (result:FolioStatus) =>{
       if(result.id != 0){
         this.disabled = false;
       }else{
         this.disabled = true;
       }
      }
    )
  }

  onChange(){
    this.disabled = true;
  }

  getBase64(value: string): string {
    return btoa(value);
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
