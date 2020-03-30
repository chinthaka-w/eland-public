import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {PatternValidation} from '../../../../shared/enum/pattern-validation.enum';
import {NewNotaryDataVarificationService} from '../../../../shared/service/new-notary-data-varification.service';
import {NewNotaryViewDto} from '../../../../shared/dto/new-notary-view.dto';
import {NewNotaryDsDivisionDTO} from '../../../../shared/dto/new-notary-ds-division.model';
import {ActivatedRoute} from '@angular/router';
import {NewNotaryRequestsCategorySearchDto} from '../../../../shared/dto/new-notary-requests-category-search.dto';
import {NotaryService} from '../../../../shared/service/notary-service';
import {Notary} from '../../../../shared/dto/notary.model';
import {GnDivision} from '../../../../shared/dto/gn-division.model';
import {DsDivision} from '../../../../shared/dto/ds-division.model';
import {JudicialZoneModel} from '../../../../shared/dto/judicial-zone.model';
import {LandRegistryModel} from '../../../../shared/dto/land-registry.model.';
import {GnDivisionService} from '../../../../shared/service/gn-division.service';
import {DsDivisionService} from '../../../../shared/service/ds-division.service';
import {LandRegistryService} from '../../../../shared/service/land-registry.service';
import {JudicialZoneService} from '../../../../shared/service/judicial-zone.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TokenStorageService} from '../../../../shared/auth/token-storage.service';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {NewNotaryPaymentDetailDto} from '../../../../shared/dto/new-notary-payment-detail.dto';
import {NotaryRegistrationHistoryDto} from '../../../../shared/dto/notary-registration-history.dto';
import {WorkflowStageDocDto} from '../../../../shared/dto/workflow-stage-doc.dto';
import {DocumentDto} from '../../../../shared/dto/document-list';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {SupportingDocService} from '../../../../shared/service/supporting-doc.service';
import {RequestSearchDetailDTO} from '../../../../shared/dto/request-search.dto';
import {WorkflowStages} from '../../../../shared/enum/workflow-stages.enum';
import {Languages} from '../../../../shared/enum/languages.enum';
import {NameChangeWorkflowStagesEnum} from '../../../../shared/enum/name-change-workflow-stages.enum';
import {NotaryRegisterType} from '../../../../shared/enum/notary-register-type.enum';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GnDivisionDTO} from '../../../../shared/dto/gn-division.dto';
import {NameTitleEnum} from '../../../../shared/enum/name-title.enum';
import {NewNotaryRegistrationWorkflowStage} from '../../../../shared/enum/new-notary-registration-workflow-stage.enum';

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


  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public landRegistry: LandRegistryModel[];
  public judicialZones: JudicialZoneModel[];
  public dsGnList: NewNotaryDsDivisionDTO[] = [];
  public gnDivi: GnDivisionDTO[] = [];
  public docList: WorkflowStageDocDto[];

  public documentList: DocumentDto[] = [];
  public notaryRequestHistoryByRemark: NotaryRegistrationHistoryDto;
  public paymentDetails: NewNotaryPaymentDetailDto[] = [];

  public notaryForm: FormGroup;
  result: NewNotaryViewDto;
  public notaryViewDetails: NewNotaryViewDto;
  searchType: NewNotaryRequestsCategorySearchDto;
  public notaryDetails: Notary;
  paymentId: number;
  newNotaryId: number;
  userName: string;
  newNotaryRegistrationRequestId: number;
  notaryTitle: string = '';
  judicialZoneId: number;
  public date: Date;
  public requestID: number;
  public type: string;
  public data: any;
  public hasRemarks: boolean = false;
  public notaryType: string;
  public isUpdatePayment: boolean = false;
  public Workflow: Workflow;
  public workFlowStageCode: string;
  public isEditable: boolean = false;

  Languages = Languages;
  NameTitle = NameTitleEnum

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
              private documetService: SupportingDocService) {
  }

  ngOnInit() {
    this.requestID = this.requestDetailId.requestId;
    // this.notaryViewDetails = this.newNotaryDataVarificationService.ViewNotaryDetails();

    this.notaryForm = this.formBuilder.group({
      // notary: new FormControl(NotaryRegisterType.NOTARY, [Validators.required]),
      title: new FormControl('', [Validators.required]),
      fullNameInEnglish: new FormControl(null, [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInSinhala: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInTamil: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      englishNameWithInitials: new FormControl(null, [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      sinhalaNameWithInitials: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      tamilNameWithInitials: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      nic: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(PatternValidation.nicValidation)],
        asyncValidators: [this.nicValidator()],
        updateOn: 'blur'
      }),
      email: new FormControl(null, [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
      languages: new FormControl(this.Languages.ENGLISH),
      enrolledDate: new FormControl(null, [Validators.required]),
      passedDate: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      courtZone: new FormControl('', [Validators.required]),
      permenentAddressInEnglish: new FormControl('', [Validators.required]),
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
      // recaptcha: new FormControl(null, Validators.required),
      // userName: new FormControl(''),
    });

    this.languages.valueChanges.subscribe(
      value => {
        switch (value) {
          case this.Languages.SINHALA:
            this.fullNameInSinhala.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)])
            this.fullNameInSinhala.updateValueAndValidity();
            this.fullNameInTamil.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.fullNameInTamil.updateValueAndValidity();

            this.sinhalaNameWithInitials.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.sinhalaNameWithInitials.updateValueAndValidity();
            this.tamilNameWithInitials.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.tamilNameWithInitials.updateValueAndValidity();

            this.permenentAddressInSinhala.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.permenentAddressInSinhala.updateValueAndValidity();
            this.permenentAddressInTamil.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.permenentAddressInTamil.updateValueAndValidity();

            this.currentAddressInSinhala.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.currentAddressInSinhala.updateValueAndValidity();
            this.currentAddressInTamil.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.currentAddressInTamil.updateValueAndValidity();
            break;
          case this.Languages.TAMIL:
            this.fullNameInSinhala.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.fullNameInSinhala.updateValueAndValidity();
            this.fullNameInTamil.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.fullNameInTamil.updateValueAndValidity();

            this.sinhalaNameWithInitials.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.sinhalaNameWithInitials.updateValueAndValidity();
            this.tamilNameWithInitials.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.tamilNameWithInitials.updateValueAndValidity();

            this.permenentAddressInSinhala.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.permenentAddressInSinhala.updateValueAndValidity();
            this.permenentAddressInTamil.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.permenentAddressInTamil.updateValueAndValidity();

            this.currentAddressInSinhala.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.currentAddressInSinhala.updateValueAndValidity();
            this.currentAddressInTamil.setValidators([Validators.required, Validators.pattern(PatternValidation.nameValidation)]);
            this.currentAddressInTamil.updateValueAndValidity();
            break;
          case this.Languages.ENGLISH:
            this.fullNameInSinhala.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.fullNameInSinhala.updateValueAndValidity();
            this.fullNameInTamil.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.fullNameInTamil.updateValueAndValidity();

            this.sinhalaNameWithInitials.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.sinhalaNameWithInitials.updateValueAndValidity();
            this.tamilNameWithInitials.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.tamilNameWithInitials.updateValueAndValidity();

            this.permenentAddressInSinhala.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.permenentAddressInSinhala.updateValueAndValidity();
            this.permenentAddressInTamil.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.permenentAddressInTamil.updateValueAndValidity();

            this.currentAddressInSinhala.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.currentAddressInSinhala.updateValueAndValidity();
            this.currentAddressInTamil.setValidators(Validators.pattern(PatternValidation.nameValidation));
            this.currentAddressInTamil.updateValueAndValidity();
            break;
        }
      }
    );

    this.getJudicialZones();
    // this.getPaymentDetails();
    this.getDsDivisions();
    this.getLandRegistries();
    // this.getLatestRemark();
    // this.getDocumentList();
    this.getApplicationDetails();

  }

  get languages(): FormControl {
    return this.notaryForm.get('languages') as FormControl;
  }

  get nic(): FormControl {
    return this.notaryForm.get('nic') as FormControl;
  }

  get sinhalaNameWithInitials(): FormControl {
    return this.notaryForm.get('sinhalaNameWithInitials') as FormControl;
  }

  get tamilNameWithInitials(): FormControl {
    return this.notaryForm.get('tamilNameWithInitials') as FormControl;
  }

  get fullNameInSinhala(): FormControl {
    return this.notaryForm.get('fullNameInSinhala') as FormControl;
  }

  get fullNameInTamil(): FormControl {
    return this.notaryForm.get('fullNameInTamil') as FormControl;
  }

  get permenentAddressInSinhala(): FormControl {
    return this.notaryForm.get('permenentAddressInSinhala') as FormControl;
  }

  get permenentAddressInTamil(): FormControl {
    return this.notaryForm.get('permenentAddressInTamil') as FormControl;
  }

  get currentAddressInSinhala(): FormControl {
    return this.notaryForm.get('currentAddressInSinhala') as FormControl;
  }

  get currentAddressInTamil(): FormControl {
    return this.notaryForm.get('currentAddressInTamil') as FormControl;
  }

  get secretariatDivision(): FormControl {
    return this.notaryForm.get('secretariatDivision') as FormControl;
  }

  get gramaNiladhariDivision(): FormControl {
    return this.notaryForm.get('gramaNiladhariDivision') as FormControl;
  }

  nicValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.notaryService.findIfNotaryExist(control.value).pipe(
        map((res: Notary) => {
          // if res is true, username exists, return true
          return res != null && res.nic != this.result.nic ? {nicExists: true} : null;
          // NB: Return null if there is no error
        })
      );
    };
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }

  // addLocation() {
  //   this.locationList.push(this.locationDto);
  //   this.locationDto = {};
  // }
  //
  // removeLocation(index) {
  //   this.locationList.splice(index, 1);
  // }

  getApplicationDetails() {
    this.searchType = new NewNotaryRequestsCategorySearchDto(this.requestDetailId.requestId, this.requestDetailId.workflow);
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
            languages: this.result.languageId,
            enrolledDate: this.result.enrolledDate,
            passedDate: this.result.subjectPassedDate,
            dateOfBirth: this.result.dateOfBirth,
            courtZone: this.result.judicialZoneId,
            permenentAddressInEnglish: this.result.permanentAddress.english,
            permenentAddressInSinhala: this.result.permanentAddress.sinhala,
            permenentAddressInTamil: this.result.permanentAddress.tamil,
            currentAddressInEnglish: this.result.currantAddress.english,
            currentAddressInSinhala: this.result.currantAddress.sinhala,
            currentAddressInTamil: this.result.currantAddress.tamil,
            mobileNo: this.result.mobile,
            contactNo: this.result.contactNo,
            landRegistry: this.result.landRegistryId,
            medium: this.result.subjectMediumId,
          }
        );

        // this.judicialZoneId = this.result.judicialZoneId;
        // this.notaryTitle = this.result.nametitle.english;
        this.dsGnList = this.result.newNotaryDsDivisionDTO;
        this.newNotaryId = this.result.newNotaryId;
        this.newNotaryRegistrationRequestId = this.result.newNotaryRegistrationRequestId;
        this.notaryType = this.result.notaryType;
        this.workFlowStageCode = this.result.workflowStageCode;
        this.setWorkflowStage();
        if (this.requestDetailId.workflow === NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_USER_MODIFIED ||
          this.requestDetailId.workflow === NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_DVC_REJECTED ||
          this.requestDetailId.workflow === NameChangeWorkflowStagesEnum.NOTARY_NAME_CHANGE_REQUEST_MODIFIED ||
          this.requestDetailId.workflow === NameChangeWorkflowStagesEnum.NOTARY_NAME_CHANGE_DATA_VERIFICATION_CLERK_REJECTED) {
          this.notaryForm.enable();
          this.isEditable = true;
        } else if (this.requestDetailId.workflow === NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_INITIALIZED ||
          this.requestDetailId.workflow === NameChangeWorkflowStagesEnum.NAME_CHANGE_REQUEST_INITIALIZED) {
          this.notaryForm.disable();
          this.isEditable = false;
        }
      },
      error1 => {
      }
    );
  }

  getPaymentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestDetailId.requestId, this.requestDetailId.workflow);
    this.newNotaryDataVarificationService.getPaymentDetails(searchType).subscribe(
      (result: NewNotaryPaymentDetailDto[]) => {
        if (result != null && result.length != 0) {
          this.paymentDetails = result;
          this.paymentId = this.paymentDetails[0].paymentId;
        }
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

  selectGnDivision(gnDivisionList: any[], index: any) {
    this.gnDivi = [];
    for (let item of gnDivisionList) {
      let gnDivision = this.getLocalGNDivisionById(item);

      const gnModel: GnDivisionDTO = new GnDivisionDTO(
        gnDivision.gnDivisionId,
        null,
        gnDivision.gnDivisionCode,
        gnDivision.description,
        gnDivision.descriptionSin,
        gnDivision.descriptionTam,
        this.secretariatDivision.value,
        null,
        null);
      this.gnDivi.push(gnModel);
    }
  }

  selectDsDivision(dsDivisionId, index) {
    if (dsDivisionId) this.getGnDivisions(dsDivisionId);

  }

  addToTable() {
    this.secretariatDivision.setValidators(Validators.required);
    this.secretariatDivision.updateValueAndValidity();
    this.gramaNiladhariDivision.setValidators(Validators.required);
    this.gramaNiladhariDivision.updateValueAndValidity();

    if (this.secretariatDivision.invalid) {
      this.secretariatDivision.markAsTouched({onlySelf: true});
      return
    }

    if (this.gramaNiladhariDivision.invalid) {
      this.gramaNiladhariDivision.markAsTouched({onlySelf: true});
      return
    }

    let dsDivision = this.getLocalDSDivisionById(this.secretariatDivision.value);

    this.dsDivision[this.dsDivision.indexOf(dsDivision)].selected = true;

    const model: NewNotaryDsDivisionDTO = new NewNotaryDsDivisionDTO(
      dsDivision.dsDivisionId,
      dsDivision.description,
      this.gnDivi);
    this.dsGnList.push(model);
    this.secretariatDivision.patchValue('');
    this.secretariatDivision.markAsUntouched({onlySelf: true});
    this.gramaNiladhariDivision.patchValue('');
    this.gramaNiladhariDivision.markAsUntouched({onlySelf: false});
  }

  getLocalGNDivisionById(id: any): GnDivision {
    return this.gnDivision.find((data: GnDivision) => {
      return data.gnDivisionId == id;
    });
  }

  getLocalDSDivisionById(id: any): DsDivision {
    return this.dsDivision.find((item: DsDivision) => {
      return item.dsDivisionId == id
    });
  }

  getDescriptionsByArray(array: GnDivision[]): string {
    let text = '';
    array.forEach((val: GnDivision) => {
      text += val.description + ', ';
    });
    return text;
  }

  setWorkflowStage() {
    let stageCode: string = this.result.workflowStageCode;
    this.newNotaryDataVarificationService.setWorkflowStage(stageCode);
  }

  public onFormSubmit() {
    this.saveNotaryDetails();
  }

  saveNotaryDetails(): void {
    // if(this.notaryForm.valid){
    this.notaryDetails = new Notary(this.newNotaryId, this.notaryForm.value.notary, this.newNotaryRegistrationRequestId, null, this.notaryForm.value.nic, this.notaryForm.value.email,
      this.notaryForm.value.dateOfBirth, this.notaryForm.value.mobileNo, this.notaryForm.value.contactNo,
      this.notaryForm.value.permenentAddressInEnglish, this.notaryForm.value.currentAddressInEnglish, this.notaryForm.value.permenentAddressInSinhala,
      this.notaryForm.value.currentAddressInSinhala, this.notaryForm.value.permenentAddressInTamil, this.notaryForm.value.currentAddressInTamil,
      this.notaryForm.value.fullNameInEnglish, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.englishNameWithInitials, this.notaryForm.value.sinhalaNameWithInitials, this.notaryForm.value.tamilNameWithInitials,
      this.notaryForm.value.title, 'Miss', 'Ms',
      this.judicialZoneId, this.notaryForm.value.landRegistry, this.dsGnList, this.notaryForm.value.languages,
      this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate, this.notaryForm.value.medium, 'status', new Date(),
      this.notaryForm.value.userName, WorkflowStages.REGISTRATION_REQ_MODIFIED, this.notaryForm.value.userName, this.paymentId, null, null, null, null, null);
    this.notaryDetail.emit(this.notaryDetails);
  }

  private getDsDivisions(): void {
    this.dsDivisionService.getAllDsDivisions().subscribe(
      (data: DsDivision[]) => {
        this.dsDivision = data;
      }
    );
  }

  private getGnDivisions(dsDivisionId: any): void {
    this.gnDivisionService.getAllGnDivisionsByDsDivisionId(dsDivisionId).subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
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

  get FormControls() {
    return this.notaryForm.controls;
  }

  onRemoveDSDivision(item: NewNotaryDsDivisionDTO, index: any) {
    this.dsDivision[this.dsDivision.indexOf(this.getLocalDSDivisionById(item.dsDivisionId))].selected = false;
    this.dsGnList.splice(index, 1);
  }

  getLatestRemark() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestDetailId.requestId, this.requestDetailId.workflow);
    this.newNotaryDataVarificationService.getLatestReamrk(searchType).subscribe(
      (result: NotaryRegistrationHistoryDto) => {
        if (result != null) {
          this.notaryRequestHistoryByRemark = result;
          this.hasRemarks = true;
        } else {
          this.hasRemarks = false;
        }
      },
      error1 => {
        console.log(error1);
      }
    )
  }
}
