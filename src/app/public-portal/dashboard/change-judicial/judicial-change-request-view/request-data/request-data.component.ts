import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {JudicialChange} from '../../../../../shared/dto/judicial-change-model';
import {JudicialService} from '../../../../../shared/service/change-judicial-service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {JudicialZoneModel} from '../../../../../shared/dto/judicial-zone.model';
import {LandRegistryModel} from '../../../../../shared/dto/land-registry.model.';
import {DsDivision} from '../../../../../shared/dto/ds-division.model';
import {GnDivisionDTO} from '../../../../../shared/dto/gn-division.dto';
import {NewNotaryDsDivisionDTO} from '../../../../../shared/dto/new-notary-ds-division.model';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {Languages} from '../../../../../shared/enum/languages.enum';
import {DsGnDivisionDTO} from '../../../../../shared/dto/gs-gn-model';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DocumentDto} from '../../../../../shared/dto/document-list';
import {JudicialChangeWorkflowStagesEnum} from '../../../../../shared/enum/judicial-change-workflow-stages.enum';
import {NewNotaryRequestsCategorySearchDto} from '../../../../../shared/dto/new-notary-requests-category-search.dto';
import {NewNotaryPaymentDetailDto} from '../../../../../shared/dto/new-notary-payment-detail.dto';
import {NewNotaryDataVarificationService} from '../../../../../shared/service/new-notary-data-varification.service';
import {WorkflowStageDocDto} from '../../../../../shared/dto/workflow-stage-doc.dto';
import {Workflow} from '../../../../../shared/enum/workflow.enum';
import {SupportingDocService} from '../../../../../shared/service/supporting-doc.service';
import {Notary} from '../../../../../shared/dto/notary.model';

@Component({
  selector: 'app-request-data',
  templateUrl: './request-data.component.html',
  styleUrls: ['./request-data.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class RequestDataComponent implements OnInit {
  @Input() workflow: string;
  @Input() id: number;
  public judicialChange: JudicialChange;
  requestForm: FormGroup;
  public gsDivisions: DsDivision[];
  public gnDivisions: GnDivisionDTO[];
  public landRegistry: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];
  public locationList: any[] = [];
  public previousSelections: any[] = [];
  public locationDto: any = {};
  public judicialChangeDto = new JudicialChange;
  public notaryId: number = 1;
  public langArr: number[];
  public isSinhala: boolean;
  public isTamil: boolean;
  public isEnglish: boolean;
  public dsGnList: DsGnDivisionDTO[] = [];
  public dsGnDivisions: NewNotaryDsDivisionDTO[] = [];
  public dsDivisionId: number;
  public isSelected: boolean;
  @Input() files: File[] = [];
  public documentList: DocumentDto[] = [];
  paymentDetails: NewNotaryPaymentDetailDto[] = [];
  paymentId: number;
  public docList: WorkflowStageDocDto[];
  @Output() jdDetail = new EventEmitter<JudicialChange>();
  public languages: any[] = [
    {
      id: Languages.ENGLISH,
      description: 'English'
    },
    {
      id: Languages.SINHALA,
      description: 'Sinhala'
    },
    {
      id: Languages.TAMIL,
      description: 'Tamil'
    }
  ];

  constructor(private judicialZoneService: JudicialService, private judicialService: JudicialService, private snackBar: SnackBarService,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService, private documetService: SupportingDocService) { }

  ngOnInit() {
    this.requestForm = new FormGroup({
      addressEng: new FormControl(""),
      addressSin: new FormControl(""),
      addressTam: new FormControl(""),
      notarialWorkStartDate: new FormControl(""),
      certificateYear: new FormControl(""),
      nameOfLr: new FormControl(""),
      isDuplicateHandedOver: new FormControl(""),
      fromDate: new FormControl("", [Validators.required]),
      toDate: new FormControl("", [Validators.required]),
      judicialZoneId: new FormControl("", [Validators.required]),
      landRegistry: new FormControl("", [Validators.required]),

    });
    this.locationList.push(this.locationDto);
    this.getLandRegistries();
    this.getJudicialZone();
    this.getDsDivision();
    this.getJudicialChangeDetails(this.id);
    this.getLanguages();
    this.isSelected = false;
    this.getPaymentDetails();
    this.getDocumentList();
    this.locationList.push(this.locationDto);
    this.locationDto = {};
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }

  addLocation() {
    this.locationList.push(this.locationDto);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.locationList.splice(index, 1);
  }


  private getDsDivision(): void {
    this.judicialService.getDsDivision().subscribe(
      (data: DsDivision[]) => {
        this.gsDivisions = data;
      }
    );
  }

  private getGnDivision(dsDivId: number): void {
    this.judicialService.getGnDivision(dsDivId).subscribe(
      (data: GnDivisionDTO[]) => {
        this.gnDivisions = data;
      }
    );
  }

  private getLandRegistries(): void {
    this.judicialService.getAllLandRegistries().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  private getJudicialZone(): void {
    this.judicialService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZone = data;
      }
    );
  }

  private getLanguages(): void {
    this.judicialService.getLanguages(this.notaryId).subscribe(
      (data: number[]) => {
        this.langArr = data;
        for (const langId of this.langArr) {
          if (langId === Languages.ENGLISH) { this.isEnglish = true; }
          if (langId === Languages.SINHALA) { this.isSinhala = true; }
          if (langId === Languages.TAMIL) { this.isTamil = true; }
        }
      }
    );
  }

  private getJudicialChangeDetails(id): void {
    this.judicialZoneService.getRequestData(id).subscribe(
      (data: JudicialChange) => {
        this.judicialChange = data;
        this.requestForm.patchValue(
          {
            addressEng: this.judicialChange.addressEng,
            addressSin: this.judicialChange.addressSin,
            addressTam: this.judicialChange.addressTam,
            notarialWorkStartDate: this.judicialChange.notarialWorkStartDate,
            certificateYear: this.judicialChange.certificateYear,
            nameOfLr: this.judicialChange.nameOfLr,
            isDuplicateHandedOver: this.judicialChange.isDuplicateHandedOver,
            fromDate: this.judicialChange.fromDate,
            toDate: this.judicialChange.toDate,
            judicialZoneId: this.judicialChange.judicialZoneId,
            landRegistry: this.judicialChange.landRegistry,

          }
        );
        this.dsGnDivisions = this.judicialChange.newNotaryDsDivisionDTO;
        if (this.workflow === JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_MODIFIED || this.workflow === JudicialChangeWorkflowStagesEnum.DATA_VERIFICATION_CLERK_REJECTED) {
          this.requestForm.enable();
        } else if (this.workflow === JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIALIZED) {
          this.requestForm.disable();
        }
      }
    );
  }

  submitForm() {
    this.judicialChangeDto = this.requestForm.value;
    this.judicialChangeDto.newNotaryId = this.notaryId;
    this.judicialChangeDto.dsGnList = this.dsGnList;
    this.judicialChangeDto.requestId = this.id;

    this.jdDetail.emit(this.judicialChangeDto);
  }

  selectGsDivision(gsDivisionId, index) {
    this.dsDivisionId = gsDivisionId;
    this.getGnDivision(gsDivisionId);
    this.gsDivisions.forEach(gsDivision => {
      if (gsDivision.dsDivisionId === gsDivisionId) {
        this.isSelected = true;
      }
      if (gsDivision.dsDivisionId === this.previousSelections[index]) {
        this.isSelected = false;
      }
    });
    this.previousSelections[index] = gsDivisionId;
  }

  selectGnDivision(gsDivisionId) {
    this.dsGnList.push(new DsGnDivisionDTO(gsDivisionId[0], this.dsDivisionId));
  }

  getPaymentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.id, this.workflow);
    this.newNotaryDataVarificationService.getPaymentDetails(searchType).subscribe(
      (result: NewNotaryPaymentDetailDto[]) => {
        this.paymentDetails = result;
        this.paymentId = this.paymentDetails[0].paymentId;
      },
      error => {
        console.log(error);
      }
    )
  }

  private getDocumentList(): void {
    this.documetService.getDocuments(Workflow.JUDICIAL_ZONE_CHANGE).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  setWorkflowStage(){
    let stageCode: string = this.judicialChange.workflowCode;
    this.newNotaryDataVarificationService.setWorkflowStage(stageCode);
  }

  public onFormSubmit() {
    this.submitForm();
  }
}
