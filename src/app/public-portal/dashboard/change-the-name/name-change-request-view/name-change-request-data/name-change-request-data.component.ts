import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Languages} from "../../../../../shared/enum/languages.enum";
import {SupportingDocService} from "../../../../../shared/service/supporting-doc.service";
import {LandRegistryService} from "../../../../../shared/service/land-registry.service";
import {GnDivisionService} from "../../../../../shared/service/gn-division.service";
import {DsDivisionService} from "../../../../../shared/service/ds-division.service";
import {SnackBarService} from "../../../../../shared/service/snack-bar.service";
import {Location} from "@angular/common";
import {WorkflowStageDocDto} from "../../../../../shared/dto/workflow-stage-doc-dto";
import {JudicialZoneModel} from "../../../../../shared/dto/judicial-zone.model";
import {LandRegistryModel} from "../../../../../shared/dto/land-registry.model.";
import {GnDivision} from "../../../../../shared/dto/gn-division.model";
import {DsDivision} from "../../../../../shared/dto/ds-division.model";
import {DocumentDto} from "../../../../../shared/dto/document-list";
import {NewNotaryDsDivisionDTO} from "../../../../../shared/dto/new-notary-ds-division.model";
import {PatternValidation} from "../../../../../shared/enum/pattern-validation.enum";
import {ChangeNameService} from "../../../../../shared/service/change-name.service";
import {NotaryNameChangeModel} from "../../../../../shared/dto/notary-name-change.model";
import {JudicialZoneService} from "../../../../../shared/service/judicial-zone.service";
import {NameChangeWorkflowStagesEnum} from "../../../../../shared/enum/name-change-workflow-stages.enum";
import {SessionService} from "../../../../../shared/service/session.service";
import {DsGnDivisionDTO} from "../../../../../shared/dto/gs-gn-model";
import {RequestSearchDetailDTO} from "../../../../../shared/dto/request-search.dto";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-name-change-request-data',
  templateUrl: './name-change-request-data.component.html',
  styleUrls: ['./name-change-request-data.component.css'],
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
export class NameChangeRequestDataComponent implements OnInit {
  @Output() nameChangeDetail = new EventEmitter<NotaryNameChangeModel>();
  @Input() requestDetailId: RequestSearchDetailDTO;
  @Input() workflow: string;
  @Input() id: number;
  @Input()
  files: File[] = [];

  public docList: WorkflowStageDocDto[];
  public judicialZones: JudicialZoneModel[];
  public landRegistry: LandRegistryModel[];
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public locationList: NewNotaryDsDivisionDTO[] = [];
  public dsGnList: DsGnDivisionDTO[] = [];
  public locationDto: any = {};
  public notaryForm: FormGroup;
  public documentList: DocumentDto[] = [];
  languages = Languages;
  public dsGnDivisions: NewNotaryDsDivisionDTO[] = [];
  public nameChangeModel: NotaryNameChangeModel;
  public nameChangeDto = new NotaryNameChangeModel();
  public notaryId: number;
  public notaryID: number;

  constructor(private documetService: SupportingDocService,
              private judicialZoneService: JudicialZoneService,
              private changeNameService: ChangeNameService,
              private landRegistryService: LandRegistryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private formBuilder: FormBuilder,
              private snackBar: SnackBarService,
              private location: Location,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.notaryForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      newFullNameInEnglish: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newFullNameInSinhala: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      newFullNameInTamil: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInEnglish: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInSinhala: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInTamil: new FormControl('',[Validators.required , Validators.pattern(PatternValidation.nameValidation)] ),
      dateOfBirth: new FormControl(new Date(), [Validators.required]),
      languages: new FormControl('' ),
      nic: new FormControl('',[Validators.required,Validators.pattern(PatternValidation.nicValidation)]),
      contactNo: new FormControl('',[Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      mobileNo: new FormControl('',[Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl('',[Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
      courtZone: new FormControl('', [Validators.required]),
      landRegistry: new FormControl('', [Validators.required]),
      secretariatDivision: new FormControl('', [Validators.required]),
      gramaNiladhariDivision: new FormControl('', [Validators.required]),
      enrolledDate: new FormControl(new Date(), [Validators.required]),
      passedDate: new FormControl(new Date(), [Validators.required]),
      medium: new FormControl('' , [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      recaptcha: new FormControl(null, Validators.required),
    });
    this.getNameChangeDetails(this.id);
    this.getDocumentList();
    this.getJudicialZones();
    this.getLandRegistries();
    this.getDsDivisions();
    this.getGnDivisions();
  }

  private getNameChangeDetails(id): void {
    this.changeNameService.getNameChangeRequestData(id).subscribe(
      (data: NotaryNameChangeModel) => {
        this.nameChangeModel = data;
        this.notaryForm.patchValue(
          {
            newFullNameInEnglish: this.nameChangeModel.newFullNameEng,
            newFullNameInSinhala: this.nameChangeModel.newFullNameSin,
            newFullNameInTamil: this.nameChangeModel.newFullNameTam,
            newInitialNameInEnglish: this.nameChangeModel.newInitialNameEng,
            newInitialNameInSinhala: this.nameChangeModel.newInitialNameSin,
            newInitialNameInTamil: this.nameChangeModel.newInitialNameTam,
          }
        );
        this.dsGnDivisions = this.nameChangeModel.newNotaryDsDivisionDTO;
      }
    );
  }

  submitForm() {
    this.nameChangeDto = this.notaryForm.value;
    this.nameChangeDto.newNotaryId = this.notaryId;
    this.nameChangeDto.dsGnList = this.dsGnList;
    this.nameChangeDto.requestId = this.id;

    this.changeNameService.update(this.nameChangeDto).subscribe(
      (success: string) => {
        this.snackBar.success('Notary Name Change Request Success');
        this.notaryForm.reset();
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  private getDocumentList(): void {
    this.documetService.getDocuments(NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  private getJudicialZones(): void {
    this.judicialZoneService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZones = data;
      }
    );
  }

  private getLandRegistries(): void {
    this.landRegistryService.getAllLandRegistry().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  private getGnDivisions(): void {
    this.gnDivisionService.getAllGnDivisions().subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
      }
    );
  }

  addLocation() {
    this.locationList.push(this.locationDto);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.locationList.splice(index, 1);
  }

  private getDsDivisions(): void {
    this.dsDivisionService.getAllDsDivisions().subscribe(
      (data: DsDivision[]) => {
        this.dsDivision = data;
      }
    );
  }

  public changes($event): void {
    this.gnDivisionService.getAllGnDivisionsByDsDivisionId(this.notaryForm.value.secretariatDivision).subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
      }
    );
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }



}
