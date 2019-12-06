import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PatternValidation} from "../../../../shared/enum/pattern-validation.enum";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {NewNotaryViewDto} from "../../../../shared/dto/new-notary-view.dto";
import {NewNotaryDsDivisionDTO} from "../../../../shared/dto/new-notary-ds-division.model";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";
import {NotaryService} from "../../../../shared/service/notary-service";
import {Notary} from "../../../../shared/dto/notary.model";
import {GnDivision} from "../../../../shared/dto/gn-division.model";
import {DsDivision} from "../../../../shared/dto/ds-division.model";
import {JudicialZoneModel} from "../../../../shared/dto/judicial-zone.model";
import {LandRegistryModel} from "../../../../shared/dto/land-registry.model.";
import {GnDivisionService} from "../../../../shared/service/gn-division.service";
import {DsDivisionService} from "../../../../shared/service/ds-division.service";
import {LandRegistryService} from "../../../../shared/service/land-registry.service";
import {JudicialZoneService} from "../../../../shared/service/judicial-zone.service";
import {DomSanitizer} from "@angular/platform-browser";
import {TokenStorageService} from "../../../../shared/auth/token-storage.service";
import {SnackBarService} from "../../../../shared/service/snack-bar.service";
import {NewNotaryPaymentDetailDto} from "../../../../shared/dto/new-notary-payment-detail.dto";
import {NotaryRegistrationHistoryDto} from "../../../../shared/dto/notary-registration-history.dto";
import {WorkflowStageDocDto} from "../../../../shared/dto/workflow-stage-doc.dto";
import {DocumentDto} from "../../../../shared/dto/document-list";
import {Workflow} from "../../../../shared/enum/workflow.enum";
import {SupportingDocService} from "../../../../shared/service/supporting-doc.service";
import {RequestSearchDetailDTO} from "../../../../shared/dto/request-search.dto";
import {WorkflowStages} from "../../../../shared/enum/workflow-stages.enum";

@Component({
  selector: 'app-notary-application',
  templateUrl: './notary-application.component.html',
  styleUrls: ['./notary-application.component.css']
})
export class NotaryApplicationComponent implements OnInit {

  @Input()
  files: File[] = [];
  @Output() notaryDetail = new EventEmitter<Notary>();
  @Input() requestDetailId: RequestSearchDetailDTO;
  dsGnDivisions: NewNotaryDsDivisionDTO[] = [];
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public landRegistry: LandRegistryModel[];
  public judicialZones: JudicialZoneModel[];
  paymentDetails: NewNotaryPaymentDetailDto[] = [];
  notaryRequestHistoryByRemark: NotaryRegistrationHistoryDto;
  public locationList: NewNotaryDsDivisionDTO[] = [];
  public locationDto: any = {};
  public docList: WorkflowStageDocDto[];
  public documentList: DocumentDto[] = [];

  public notaryForm: FormGroup;
  result: NewNotaryViewDto;
  public notaryViewDetails: NewNotaryViewDto;
  searchType: NewNotaryRequestsCategorySearchDto ;
  public notaryDetails: Notary;
  paymentId: number;
  newNotaryId: number;
  userName: string;
  newNotaryRegistrationRequestId: number;
  notaryTitle: string = '';
  public date: Date;
  public requestID: number;
  public type: string;
  public data: any;
  public hasRemarks: boolean = false;
  public notaryType: string;
  public isUpdatePayment: boolean = false;
  public Workflow: Workflow;

  constructor(private formBuilder: FormBuilder,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService,
              private route: ActivatedRoute,
              private notaryService: NotaryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private landRegistryService: LandRegistryService,
              private judicialZoneService: JudicialZoneService,
              private sanitizer: DomSanitizer,
              private tokenStorageService: TokenStorageService,
              private snackBar: SnackBarService,
              private documetService: SupportingDocService) { }

  ngOnInit() {
    this.requestID = this.requestDetailId.requestId;
    this.notaryViewDetails = this.newNotaryDataVarificationService.ViewNotaryDetails();

    this.notaryForm = this.formBuilder.group({
      title: new FormControl([Validators.required]),
      englishNameWithInitials: new FormControl([Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      sinhalaNameWithInitials: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      tamilNameWithInitials: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInEnglish: new FormControl([Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInSinhala: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInTamil: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      nic: new FormControl([Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
      email: new FormControl([Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
      languages: new FormControl(''),
      enrolledDate: new FormControl([Validators.required]),
      passedDate: new FormControl([Validators.required]),
      dateOfBirth: new FormControl([Validators.required]),
      courtZone: new FormControl([Validators.required]),
      permenentAddressInEnglish: new FormControl([Validators.required]),
      permenentAddressInSinhala: new FormControl(''),
      permenentAddressInTamil: new FormControl(''),
      currentAddressInEnglish: new FormControl('', [Validators.required]),
      currentAddressInSinhala: new FormControl(''),
      currentAddressInTamil: new FormControl(''),
      mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
      contactNo: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      landRegistry: new FormControl('', [Validators.required]),
      secretariatDivision: new FormControl('', [Validators.required]),
      gramaNiladhariDivision: new FormControl('', [Validators.required]),
      medium: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
    });
    this.getApplicationDetails();
    this.getPaymentDetails();
    this.getGnDivisions();
    this.getDsDivisions();
    this.getLandRegistries();
    this.getJudicialZones();
    this.getLatestRemark();
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


  getApplicationDetails() {
    this.searchType = new NewNotaryRequestsCategorySearchDto(81,Workflow.NOTARY_REGISTRATION);
    this.newNotaryDataVarificationService.getNotaryDetails(this.searchType).subscribe(
      (result: NewNotaryViewDto) => {
        this.result = result;
        this.notaryForm.patchValue(
          {
            title: this.result.nametitle.english,
            englishNameWithInitials: this.result.nameWithInitial.english,
            sinhalaNameWithInitials: this.result.nameWithInitial.sinhala,
            tamilNameWithInitials: this.result.nameWithInitial.tamil,
            fullNameInEnglish: this.result.fullName.english,
            fullNameInSinhala: this.result.fullName.sinhala,
            fullNameInTamil: this.result.fullName.tamil,
            nic: this.result.nic,
            email: this.result.email,
            languages: this.result.language,
            enrolledDate: this.result.enrolledDate,
            passedDate: this.result.subjectPassedDate,
            dateOfBirth: this.result.dateOfBirth,
            courtZone: this.result.judicialZone,
            permenentAddressInEnglish: this.result.permanentAddress.english,
            permenentAddressInSinhala: this.result.permanentAddress.sinhala,
            permenentAddressInTamil: this.result.permanentAddress.tamil,
            currentAddressInEnglish: this.result.currantAddress.english,
            currentAddressInSinhala: this.result.currantAddress.sinhala,
            currentAddressInTamil: this.result.currantAddress.tamil,
            mobileNo: this.result.mobile,
            contactNo: this.result.contactNo,
            landRegistry: this.result.landRegistry,
            userName: this.result.lastUpdatedUser,
            medium: this.result.language,
          }
        );
        this.notaryTitle = this.result.nametitle.english;
        this.dsGnDivisions = this.result.newNotaryDsDivisionDTO;
        this.newNotaryId = this.result.newNotaryId;
        this.newNotaryRegistrationRequestId = this.result.newNotaryRegistrationRequestId;
        this.notaryType = this.result.notaryType;
        this.setWorkflowStage();
      },
      error1 => {
      }
    );
  }

  getPaymentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestDetailId.requestId, this.requestDetailId.workflow);
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
    this.documetService.getDocuments(Workflow.NOTARY_REGISTRATION).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  setWorkflowStage(){
    let stageCode: string = this.result.workflowStageCode;
    this.newNotaryDataVarificationService.setWorkflowStage(stageCode);
  }

  public onFormSubmit() {
    this.saveNotaryDetails();
  }
  saveNotaryDetails(): void {
    if(this.notaryForm.valid){
      this.notaryDetails = new Notary(this.newNotaryId, this.notaryForm.value.notary, this.newNotaryRegistrationRequestId, null, this.notaryForm.value.nic, this.notaryForm.value.email,
        this.notaryForm.value.dateOfBirth, this.notaryForm.value.mobileNo,  this.notaryForm.value.contactNo,
        this.notaryForm.value.permenentAddressInEnglish, this.notaryForm.value.currentAddressInEnglish, this.notaryForm.value.permenentAddressInSinhala,
        this.notaryForm.value.currentAddressInSinhala,  this.notaryForm.value.permenentAddressInTamil, this.notaryForm.value.currentAddressInTamil,
        this.notaryForm.value.fullNameInEnglish, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
        this.notaryForm.value.englishNameWithInitials,   this.notaryForm.value.sinhalaNameWithInitials, this.notaryForm.value.tamilNameWithInitials,
        this.notaryForm.value.title, 'Miss', 'Ms',
        1, this.notaryForm.value.landRegistry, this.dsGnDivisions, this.notaryForm.value.languages,
        this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate, this.notaryForm.value.medium, 'status', new Date(), "Ishani","ss",  this.notaryForm.value.userName,this.paymentId,WorkflowStages.REGISTRATION_REQ_MODIFIED);

      this.notaryDetail.emit(this.notaryDetails);
      this.notaryService.setNotaryDetails(this.notaryDetails);
      this.notaryDetails = this.notaryService.getNotaryDetails();

      this.notaryService.updateNotaryDetails(this.notaryDetails).subscribe(
        (success: string) => {
          this.snackBar.success('Notary Registration Success');
        },
        error => {
          this.snackBar.error('Failed');
        }
      );
    }
  }

  private getGnDivisions(): void {
    this.gnDivisionService.getAllGnDivisions().subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data ;
      }
    );
  }

  private getDsDivisions(): void {
    this.dsDivisionService.getAllDsDivisions().subscribe(
      (data: DsDivision[]) => {
        this.dsDivision = data;
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

  public changes($event): void {
    this.gnDivisionService.getAllGnDivisionsByDsDivisionId(this.notaryForm.value.secretariatDivision).subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
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

  get FormControls() {
    return this.notaryForm.controls;
  }

  getLatestRemark() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestDetailId.requestId,this.requestDetailId.workflow);
    this.newNotaryDataVarificationService.getLatestReamrk(searchType).subscribe(
      (result: NotaryRegistrationHistoryDto) => {
        if(result != null){
          this.notaryRequestHistoryByRemark = result;
          this.hasRemarks = true;
        }else{
          this.hasRemarks = false;
        }
      },
      error1 => {
        console.log(error1);
      }
    )
  }
}
