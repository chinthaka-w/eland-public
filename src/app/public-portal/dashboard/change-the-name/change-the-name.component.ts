import {Component, Input, OnInit} from '@angular/core';
import {WorkflowStageDocDto} from "../../../shared/dto/workflow-stage-doc-dto";
import {Workflow} from "../../../shared/enum/workflow.enum";
import {SupportingDocService} from "../../../shared/service/supporting-doc.service";
import {Languages} from "../../../shared/enum/languages.enum";
import {JudicialZoneModel} from "../../../shared/dto/judicial-zone.model";
import {JudicialZoneService} from "../../../shared/service/judicial-zone.service";
import {LandRegistryModel} from "../../../shared/dto/land-registry.model.";
import {LandRegistryService} from "../../../shared/service/land-registry.service";
import {GnDivision} from "../../../shared/dto/gn-division.model";
import {DsDivision} from "../../../shared/dto/ds-division.model";
import {GnDivisionService} from "../../../shared/service/gn-division.service";
import {DsDivisionService} from "../../../shared/service/ds-division.service";
import {NewNotaryDsDivisionDTO} from "../../../shared/dto/new-notary-ds-division.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DocumentDto} from "../../../shared/dto/document-list";
import {PatternValidation} from "../../../shared/enum/pattern-validation.enum";
import {PaymentResponse} from "../../../shared/dto/payment-response.model";
import {SnackBarService} from "../../../shared/service/snack-bar.service";
import {Location} from "@angular/common";
import {Parameters} from "../../../shared/enum/parameters.enum";
import {NameChangeWorkflowStagesEnum} from "../../../shared/enum/name-change-workflow-stages.enum";
import {NotaryNameChangeModel} from "../../../shared/dto/notary-name-change.model";
import {ChangeNameService} from "../../../shared/service/change-name.service";
import {SessionService} from "../../../shared/service/session.service";
import {RequestSearchDetailDTO} from "../../../shared/dto/request-search.dto";
import {NotaryService} from "../../../shared/service/notary-service";
import {WorkflowStages} from "../../../shared/enum/workflow-stages.enum";
import {NameTitleEnum} from "../../../shared/enum/name-title.enum";

@Component({
  selector: 'app-change-the-name',
  templateUrl: './change-the-name.component.html',
  styleUrls: ['./change-the-name.component.css']
})
export class ChangeTheNameComponent implements OnInit {
  @Input()
  files: File[] = [];

  public docList: WorkflowStageDocDto[];
  languages = Languages;
  nameTitle = NameTitleEnum;
  public judicialZones: JudicialZoneModel[];
  public landRegistry: LandRegistryModel[];
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public locationList: NewNotaryDsDivisionDTO[] = [];
  public locationDto: any = {};
  public notaryForm: FormGroup;
  public documentList: DocumentDto[] = [];
  Parameters = Parameters;
  WorkflowCode = NameChangeWorkflowStagesEnum;
  public nameChangeModel = new NotaryNameChangeModel();
  public searchDetails: RequestSearchDetailDTO;

  public notaryId: number;
  public paymentId: number;
  public isPaymentSuccess: boolean;
  public isContinueToPayment: boolean = false;
  public requestId: number;


  constructor(private documetService: SupportingDocService,
              private judicialZoneService: JudicialZoneService,
              private landRegistryService: LandRegistryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private formBuilder: FormBuilder,
              private snackBar: SnackBarService,
              private nameChangeService: ChangeNameService,
              private location: Location,
              private sessionService: SessionService,
              private notaryService: NotaryService) { }

  ngOnInit() {
    this.notaryId = this.sessionService.getUser().id;
    this.getUserDetails();
    this.notaryForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      newFullNameInEnglish: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newFullNameInSinhala: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      newFullNameInTamil: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInEnglish: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInSinhala: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      newInitialNameInTamil: new FormControl('',[Validators.required , Validators.pattern(PatternValidation.nameValidation)] ),
      dateOfBirth: new FormControl(new Date()),
      languages: new FormControl('' ),
      nic: new FormControl('',[Validators.pattern(PatternValidation.nicValidation)]),
      contactNo: new FormControl('',[ Validators.pattern(PatternValidation.contactNumberValidation)]),
      mobileNo: new FormControl('',[ Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl('',[ Validators.pattern(PatternValidation.emailValidation)]),
      courtZone: new FormControl('' ),
      landRegistry: new FormControl(''),
      secretariatDivision: new FormControl(''),
      gramaNiladhariDivision: new FormControl(''),
      enrolledDate: new FormControl(new Date()),
      passedDate: new FormControl(new Date()),
      medium: new FormControl('' ),
      userName: new FormControl(''),
      recaptcha: new FormControl(null),
    });
    this.getDocumentList();
    this.getJudicialZones();
    this.getLandRegistries();
    this.getDsDivisions();
    this.getGnDivisions();
    this.isPaymentSuccess = false;
    this.isContinueToPayment = false;

  }

  getUserDetails(){
    this.notaryService.getNotaryRequestDetails(this.notaryId).subscribe(
      (data: RequestSearchDetailDTO) =>{
        this.searchDetails = data;
        this.requestId = this.searchDetails.requestId;
      }
    )
  }


  submitForm() {
    this.nameChangeModel.judicialZoneId = this.notaryForm.value.courtZone;
    this.nameChangeModel.newFullNameEng = this.notaryForm.value.newFullNameInEnglish;
    this.nameChangeModel.newFullNameSin = this.notaryForm.value.newFullNameInSinhala;
    this.nameChangeModel.newFullNameTam = this.notaryForm.value.newFullNameInTamil;
    this.nameChangeModel.newInitialNameEng = this.notaryForm.value.newInitialNameInEnglish;
    this.nameChangeModel.newInitialNameSin = this.notaryForm.value.newInitialNameInSinhala;
    this.nameChangeModel.newInitialNameTam = this.notaryForm.value.newInitialNameInTamil;
    this.nameChangeModel.newNotaryId = this.notaryId;
    this.nameChangeModel.paymentId = this.paymentId;

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.nameChangeModel));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.nameChangeService.save(formData).subscribe(
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
        this.gnDivision = data ;
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


  onClickSubmitSearchRequest() {
    this.isContinueToPayment = !this.isContinueToPayment;
  }

  public onFormSubmit() {
    this.isContinueToPayment = true;
    this.isPaymentSuccess = false;
  }

  onPaymentResponse(data: PaymentResponse) {
    if (data.paymentStatusCode === 2 || data.paymentId === undefined || data.paymentId === 0) {
      this.snackBar.error('Failed');
    } else {
      this.paymentId = data.paymentId;
      this.isContinueToPayment = false;
      this.isPaymentSuccess = true;
      this.submitForm();
    }
  }

  onBack(data: boolean) {
    this.isContinueToPayment = !data;
  }

  goBack(): any {
    this.location.back();
    return false;
  }

}
