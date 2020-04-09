import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Languages} from '../../../../../shared/enum/languages.enum';
import {SupportingDocService} from '../../../../../shared/service/supporting-doc.service';
import {LandRegistryService} from '../../../../../shared/service/land-registry.service';
import {GnDivisionService} from '../../../../../shared/service/gn-division.service';
import {DsDivisionService} from '../../../../../shared/service/ds-division.service';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {Location} from '@angular/common';
import {WorkflowStageDocDto} from '../../../../../shared/dto/workflow-stage-doc-dto';
import {JudicialZoneModel} from '../../../../../shared/dto/judicial-zone.model';
import {LandRegistryModel} from '../../../../../shared/dto/land-registry.model.';
import {GnDivision} from '../../../../../shared/dto/gn-division.model';
import {DsDivision} from '../../../../../shared/dto/ds-division.model';
import {DocumentDto} from '../../../../../shared/dto/document-list';
import {NewNotaryDsDivisionDTO} from '../../../../../shared/dto/new-notary-ds-division.model';
import {PatternValidation} from '../../../../../shared/enum/pattern-validation.enum';
import {ChangeNameService} from '../../../../../shared/service/change-name.service';
import {NotaryNameChangeModel} from '../../../../../shared/dto/notary-name-change.model';
import {JudicialZoneService} from '../../../../../shared/service/judicial-zone.service';
import {NameChangeWorkflowStagesEnum} from '../../../../../shared/enum/name-change-workflow-stages.enum';
import {SessionService} from '../../../../../shared/service/session.service';
import {DsGnDivisionDTO} from '../../../../../shared/dto/gs-gn-model';
import {RequestSearchDetailDTO} from '../../../../../shared/dto/request-search.dto';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NewNotaryRequestsCategorySearchDto} from '../../../../../shared/dto/new-notary-requests-category-search.dto';
import {NewNotaryPaymentDetailDto} from '../../../../../shared/dto/new-notary-payment-detail.dto';
import {NewNotaryDataVarificationService} from '../../../../../shared/service/new-notary-data-varification.service';
import {ActivatedRoute} from '@angular/router';
import {NameTitleEnum} from '../../../../../shared/enum/name-title.enum';
import {NameTitleDTO} from '../../../../../shared/dto/name-title.dto';
import {LanguageChangeService} from '../../../../../shared/service/language-change.service';

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
  @Input() id;
  @Input() files: File[] = [];

  @Input() editable: boolean = false;

  nameTitles: NameTitleDTO[] = [];

  public isSinhala: boolean = false;
  public isTamil: boolean = false;
  public isEnglish: boolean = true;

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
  paymentDetails: NewNotaryPaymentDetailDto[] = [];
  paymentId: number;
  public notaryId: number;
  public workflowStageCode: string;
  nameTitle = NameTitleEnum;

  constructor(private documetService: SupportingDocService,
              private judicialZoneService: JudicialZoneService,
              private changeNameService: ChangeNameService,
              private landRegistryService: LandRegistryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private formBuilder: FormBuilder,
              private snackBar: SnackBarService,
              private location: Location,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService,
              private sessionService: SessionService,
              private languageChangeService: LanguageChangeService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.route.params.subscribe(params =>{
      this.id = atob(params['id']);
      this.workflow = atob(params['workflow']);
      this.workflowStageCode = atob(params['workflowStage']);
    });

    if (this.workflowStageCode === NameChangeWorkflowStagesEnum.NOTARY_NAME_CHANGE_DATA_VERIFICATION_CLERK_REJECTED) {
      this.editable = true;
    }
    this.setData();
  }

  setData() {
    this.notaryForm = this.formBuilder.group({
      title: new FormControl(0, [Validators.required]),
      newFullNameInEnglish: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      newFullNameInSinhala: new FormControl('', this.isSinhala ? Validators.required : null),
      newFullNameInTamil: new FormControl('', this.isTamil ? Validators.required : null),
      newInitialNameInEnglish: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInSinhala: new FormControl('', this.isSinhala ? Validators.required : null),
      newInitialNameInTamil: new FormControl('', this.isTamil ? Validators.required : null),
      languages: new FormControl(),
    });
    this.getNameTitles();
    this.getDocumentList();
    this.getJudicialZones();
    this.getLandRegistries();
    this.getDsDivisions();
    this.getGnDivisions();
    this.getPaymentDetails();
    this.getNameChangeDetails(this.id);
  }

  private getNameTitles() {
    this.languageChangeService.getNameTitle().subscribe(
      (result: NameTitleDTO[]) => {
        this.nameTitles = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  private addLanguageList(id:number): void {
    if(id === Languages.SINHALA)
      this.isSinhala = (!this.isSinhala);
    if(id === Languages.TAMIL)
      this.isTamil = (!this.isTamil);

    this.setData();
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

  private getNameChangeDetails(id): void {
    this.changeNameService.getNameChangeRequestData(id).subscribe(
      (data: NotaryNameChangeModel) => {
        this.nameChangeModel = data;
        this.workflowStageCode = data.workflowStageCode;
        this.notaryForm.patchValue(
          {
            title: this.nameChangeModel.title,
            newFullNameInEnglish: this.nameChangeModel.newFullNameEng,
            newFullNameInSinhala: this.nameChangeModel.newFullNameSin,
            newFullNameInTamil: this.nameChangeModel.newFullNameTam,
            newInitialNameInEnglish: this.nameChangeModel.newInitialNameEng,
            newInitialNameInSinhala: this.nameChangeModel.newInitialNameSin,
            newInitialNameInTamil: this.nameChangeModel.newInitialNameTam,
          }
        );
        this.dsGnDivisions = this.nameChangeModel.newNotaryDsDivisionDTO;
        if (!this.editable) { this.notaryForm.disable(); }
      }
    );
  }

  submitForm() {
    this.nameChangeDto = this.notaryForm.value;
    this.nameChangeDto.newNotaryId = this.sessionService.getUser().id;
    this.nameChangeDto.dsGnList = this.dsGnList;
    this.nameChangeDto.requestId = this.id;
    this.nameChangeDto.paymentId = this.paymentId;

    this.changeNameService.update(this.nameChangeDto).subscribe(
      (success: string) => {
        this.snackBar.success('Notary Name Change Request Success');
        this.notaryForm.reset();
        this.nameChangeDetail.emit(this.nameChangeDto);
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


  // Update Name change data and documents
  onFormSubmit() {
    if (this.notaryForm.invalid)
      return;

    this.nameChangeModel.newFullNameEng = this.notaryForm.value.newFullNameInEnglish;
    this.nameChangeModel.newFullNameSin = this.notaryForm.value.newFullNameInSinhala;
    this.nameChangeModel.newFullNameTam = this.notaryForm.value.newFullNameInTamil;
    this.nameChangeModel.newInitialNameEng = this.notaryForm.value.newInitialNameInEnglish;
    this.nameChangeModel.newInitialNameSin = this.notaryForm.value.newInitialNameInSinhala;
    this.nameChangeModel.newInitialNameTam = this.notaryForm.value.newInitialNameInTamil;
    this.nameChangeModel.newNotaryId = this.notaryId;
    this.nameChangeModel.title = this.notaryForm.value.title;
    this.nameChangeModel.requestId = this.id;

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.nameChangeModel));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.changeNameService.updateDetails(formData).subscribe(
      (success: boolean) => {
        if (success) {
          this.snackBar.success('Notary Name Change Request updated Successfully');
          this.setData();
        } else {
          this.snackBar.error('Operation failed');
        }
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }


}
