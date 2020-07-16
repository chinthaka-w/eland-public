import {SystemService} from './../../../shared/service/system.service';
import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Notary} from '../../../shared/dto/notary.model';
import {NotaryService} from '../../../shared/service/notary-service';
import {GnDivisionService} from '../../../shared/service/gn-division.service';
import {GnDivision} from '../../../shared/dto/gn-division.model';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {DsDivisionService} from '../../../shared/service/ds-division.service';
import {LandRegistryService} from '../../../shared/service/land-registry.service';
import {NewNotaryDsDivisionDTO} from '../../../shared/dto/new-notary-ds-division.model';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {JudicialZoneService} from '../../../shared/service/judicial-zone.service';
import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {GnDivisionDTO} from '../../../shared/dto/gn-division.dto';
import {MatRadioChange} from '@angular/material/radio';
import {DomSanitizer} from '@angular/platform-browser';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {PaymentService} from '../../../shared/service/payment.service';
import {PaymentComponent} from '../../../shared/components/payment/payment.component';
import {PaymentMethodComponent} from '../../../shared/components/payment/payment-method/payment-method.component';
import {Workflow} from '../../../shared/enum/workflow.enum';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc.dto';
import {DocumentDto} from '../../../shared/dto/document-list';
import {WorkflowStages} from '../../../shared/enum/workflow-stages.enum';
import {SupportingDocService} from '../../../shared/service/supporting-doc.service';
import {Languages} from '../../../shared/enum/languages.enum';
import {Router} from '@angular/router';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PaymentDto} from '../../../shared/dto/payment-dto';
import {until} from 'selenium-webdriver';
import titleContains = until.titleContains;
import {NotaryRegisterType} from '../../../shared/enum/notary-register-type.enum';
import {NameTitleEnum} from '../../../shared/enum/name-title.enum';
import {PublicUserDetails} from '../../../shared/dto/public-user-detail.model';
import {PublicUserService} from '../../../shared/service/public-user.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CommonStatus} from '../../../shared/enum/common-status.enum';
import {NameTitleService} from '../../../shared/service/name-title.service';
import {NameTitleDTO} from '../../../shared/dto/name-title.dto';
import {PublicUserType} from '../../../shared/enum/public-user-type.enum';
import {NewNotaryRegistrationWorkflowStage} from '../../../shared/enum/new-notary-registration-workflow-stage.enum';
import {UserType} from '../../../shared/enum/user-type.enum';
import * as _ from 'lodash';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';
import * as moment from 'moment';
import {AuthorizeRequestService} from '../../../shared/service/authorize-request.service';

@Component({
  selector: 'app-add-notary',
  templateUrl: './add-notary.component.html',
  styleUrls: ['./add-notary.component.css']
})

export class AddNotaryComponent implements OnInit {
  Parameters = Parameters;
  WorkflowCode = Workflow;
  Languages = Languages;
  NotaryRegisterType = NotaryRegisterType;
  UserType = UserType;
  NameTitle = NameTitleEnum;

  public isContinueToPayment: boolean = false;
  public paymentResponse = new PaymentResponse;


  @Output()
  change: EventEmitter<MatRadioChange>;
  @Input()
  files: File[] = [];
  @Input()
  file: File[] = [];
  @Input()
  deleteButtonLabel;
  @Input()
  deleteButtonIcon = 'close';
  @Input()
  showUploadInfo;
  @Input()
  checked: Boolean;
  @ViewChild(PaymentComponent, {static: false}) paymentComponent: PaymentComponent;
  @ViewChild(PaymentMethodComponent, {static: false}) paymentMethodComponent: PaymentMethodComponent;
  public payment: any;
  public paymentDataValue: PaymentDto;

  public notaryForm: FormGroup;
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public dsDivisions: DsDivision[] = [];
  public landRegistry: LandRegistryModel[];
  public judicialZones: JudicialZoneModel[];
  public nameTitles: NameTitleDTO[];
  public notaryDetails: Notary;
  public isSelected: boolean;
  public disabled: boolean = false;
  paymentDto: PaymentDto = new PaymentDto();
  selected = 'Notary';

  public docList: WorkflowStageDocDto[];
  public documentList: DocumentDto[] = [];


  public dsGnList: NewNotaryDsDivisionDTO[] = [];
  public gnDivi: GnDivisionDTO[] = [];

  isPayment: boolean = false;

  paymentMethod: number;
  returnURl: string;
  statusOnlinePayment: boolean;

  errorMsg: any;

  today: any;
  defaultBirthDay: any;

  userId: any;
  WorkflowStages = WorkflowStages;

  get languages(): FormControl {
    return this.notaryForm.get('languages') as FormControl;
  }

  get dateOfBirth(): FormControl {
    return this.notaryForm.get('dateOfBirth') as FormControl;
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

  get reCaptcha(): FormControl {
    return this.notaryForm.get('recaptcha') as FormControl;
  }

  get enrolledDate(): FormControl {
    return this.notaryForm.get('enrolledDate') as FormControl;
  }

  get passedDate(): FormControl {
    return this.notaryForm.get('passedDate') as FormControl;
  }

  constructor(private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private tokenStorageService: TokenStorageService,
              private snackBar: SnackBarService,
              private router: Router,
              private systemService: SystemService,
              private notaryService:NotaryService,
              private authorizeRequestService: AuthorizeRequestService,
              private cdr: ChangeDetectorRef,
              private sysMethodService: SysMethodsService) {
    this.today = new Date();

    let dob = new Date();
    dob.setFullYear(dob.getFullYear() - 18);
    this.defaultBirthDay = dob;
  }

  ngOnInit() {
    this.notaryForm = this.formBuilder.group({
      notary: new FormControl(NotaryRegisterType.NOTARY, [
        Validators.required]),
      title: new FormControl('', [
        Validators.required]),
      fullNameInEnglish: new FormControl(null, [
        Validators.required,
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      fullNameInSinhala: new FormControl(null, [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      fullNameInTamil: new FormControl(null, [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      englishNameWithInitials: new FormControl(null, [
        Validators.required,
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      sinhalaNameWithInitials: new FormControl(null, [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      tamilNameWithInitials: new FormControl(null, [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      nic: new FormControl(null, {
        validators: [Validators.required,
          Validators.pattern(PatternValidation.nicValidation),
          this.dobByNICValidator()],
        asyncValidators: [this.nicValidator()],
        updateOn: 'blur'
      }),
      email: new FormControl(null,{
        validators: [Validators.required, Validators.pattern(PatternValidation.emailValidation)],
          asyncValidators: [this.emailValidator()],
          updateOn: 'blur'
      }
        ),
      languages: new FormControl(this.Languages.ENGLISH),
      enrolledDate: new FormControl(null, [Validators.required]),
      passedDate: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      courtZone: new FormControl('', [Validators.required]),
      permenentAddressInEnglish: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      permenentAddressInSinhala: new FormControl('',[
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      permenentAddressInTamil: new FormControl('',[
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      currentAddressInEnglish: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      currentAddressInSinhala: new FormControl('',[
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      currentAddressInTamil: new FormControl('',[
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
      contactNo: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      landRegistry: new FormControl('', [Validators.required]),
      secretariatDivision: new FormControl('', [Validators.required]),
      gramaNiladhariDivision: new FormControl('', [Validators.required]),
      medium: new FormControl('', [Validators.required]),
      recaptcha: new FormControl(null, Validators.required),
      userName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        asyncValidators: [this.usernameValidator()],
        updateOn: 'blur'
      }),
    });

    this.languages.valueChanges.subscribe(
      value => {
        switch (value) {
          case this.Languages.SINHALA:
            this.fullNameInSinhala.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)])
            this.fullNameInSinhala.updateValueAndValidity();
            this.fullNameInTamil.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.fullNameInTamil.updateValueAndValidity();

            this.sinhalaNameWithInitials.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.sinhalaNameWithInitials.updateValueAndValidity();
            this.tamilNameWithInitials.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.tamilNameWithInitials.updateValueAndValidity();

            this.permenentAddressInSinhala.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.permenentAddressInSinhala.updateValueAndValidity();
            this.permenentAddressInTamil.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.permenentAddressInTamil.updateValueAndValidity();

            this.currentAddressInSinhala.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.currentAddressInSinhala.updateValueAndValidity();
            this.currentAddressInTamil.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.currentAddressInTamil.updateValueAndValidity();
            break;
          case this.Languages.TAMIL:
            this.fullNameInSinhala.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.fullNameInSinhala.updateValueAndValidity();
            this.fullNameInTamil.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.fullNameInTamil.updateValueAndValidity();

            this.sinhalaNameWithInitials.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.sinhalaNameWithInitials.updateValueAndValidity();
            this.tamilNameWithInitials.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.tamilNameWithInitials.updateValueAndValidity();

            this.permenentAddressInSinhala.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.permenentAddressInSinhala.updateValueAndValidity();
            this.permenentAddressInTamil.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.permenentAddressInTamil.updateValueAndValidity();

            this.currentAddressInSinhala.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.currentAddressInSinhala.updateValueAndValidity();
            this.currentAddressInTamil.setValidators([
              Validators.required,
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.currentAddressInTamil.updateValueAndValidity();
            break;
          case this.Languages.ENGLISH:
            this.fullNameInSinhala.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.fullNameInSinhala.updateValueAndValidity();
            this.fullNameInTamil.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.fullNameInTamil.updateValueAndValidity();

            this.sinhalaNameWithInitials.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.sinhalaNameWithInitials.updateValueAndValidity();
            this.tamilNameWithInitials.setValidators([
              Validators.pattern(PatternValidation.nameValidation),
              Validators.maxLength(255)]);
            this.tamilNameWithInitials.updateValueAndValidity();

            this.permenentAddressInSinhala.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.permenentAddressInSinhala.updateValueAndValidity();
            this.permenentAddressInTamil.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.permenentAddressInTamil.updateValueAndValidity();

            this.currentAddressInSinhala.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.currentAddressInSinhala.updateValueAndValidity();
            this.currentAddressInTamil.setValidators([
              Validators.pattern(PatternValidation.ADDRESS_PATTERN),
              Validators.maxLength(255)]);
            this.currentAddressInTamil.updateValueAndValidity();
            break;
        }
      }
    );

    this.dateOfBirth.valueChanges.subscribe(value => {
      this.nic.updateValueAndValidity();
    });

    this.notaryForm.valueChanges.subscribe(value => {
      if (this.dsGnList.length != 0) {
        this.secretariatDivision.clearValidators();
        this.secretariatDivision.updateValueAndValidity();
        this.gramaNiladhariDivision.clearValidators();
        this.gramaNiladhariDivision.updateValueAndValidity();
      }
    });

    this.getNameTitles();
    this.getDsDivisions();
    this.getJudicialZones();
    this.getDocumentList();
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.authorizeRequestService.checkIfUsernameExists(control.value).pipe(
        map(res => {
          // if res is true, username exists, return true
          return res ? {usernameExists: true} : null;
          // NB: Return null if there is no error
        })
      );
    };
  }

  nicValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.authorizeRequestService.findIfNotaryExist(control.value).pipe(
        map(res => {
          // if res is true, username exists, return true
          return res != null ? {nicExists: true} : null;
          // NB: Return null if there is no error
        })
      );
    };
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.notaryService.findEmailIfNotaryExist(control.value).pipe(
        map(res => {
          // if res is true, username exists, return true
          return res != null ? {emailExists: true} : null;
          // NB: Return null if there is no error
        })
      );
    };
  }

  dobByNICValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      if (!this.notaryForm) return null;
      const dateOfBirthByNIC = this.sysMethodService.getDateOfBirthByNic(control.value);
      const dateOfBirth = moment(this.dateOfBirth.value).format('YYYY-MM-DD');
      return (dateOfBirth == dateOfBirthByNIC) ? null : {nicInvalid: true};

    }
  }

  private getDocumentList(): void {
    this.authorizeRequestService.getDocuments(NewNotaryRegistrationWorkflowStage.NOTARY_REGISTRATION_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  setFiles(data: any, doc: any) {
    doc.selected = true;
    this.files = data;
    let document = this.isDocumentAvailable(doc.docTypeId);
    if (document) {
      let index = this.documentList.findIndex((data: DocumentDto) => {
        return data == document
      });
      if (data.length != 0) {
        this.documentList[index].files = this.files[0];
      } else {
        this.documentList.splice(index, 1);
      }
    } else {
      this.documentList.push(new DocumentDto(this.files[0], doc.docTypeId));
    }
    this.checkDocumentValidation();
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

  selectJudicialZone(judicialId: any) {
    if (judicialId) this.getLandRegistries(judicialId);
  }

  selectNotaryType(value: any) {

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

  checkDocumentValidation() {
    let invalid = false;
    this.docList.forEach((item: WorkflowStageDocDto) => {
      if (item.required && !this.isDocumentAvailable(item.docTypeId)) {
        item.invalid = true;
        invalid = true;
      } else {
        item.invalid = false;
      }
    });
    return invalid;
  }

  isDocumentAvailable(docTypeId: any): any {
    return this.documentList.find((data: DocumentDto) => {
        return data.fileType == docTypeId;
      }
    );
  }

  public resolved(data: any) {
    this.reCaptcha.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  public onFormSubmit() {
    this.errorMsg = undefined;
    if (this.dsGnList.length != 0) {
      this.secretariatDivision.clearValidators();
      this.secretariatDivision.updateValueAndValidity();
      this.gramaNiladhariDivision.clearValidators();
      this.gramaNiladhariDivision.updateValueAndValidity();
    }

    if (this.notaryForm.invalid || this.checkDocumentValidation()) {
      Object.keys(this.notaryForm.controls).forEach(field => {
        const control = this.notaryForm.get(field);
        control.markAsTouched({onlySelf: true});
      });
      // this.snackBar.error('Please fill all mandatory fields!');
      this.errorMsg = 'Please fill all mandatory fields!';
    } else {
      this.isPayment = true;
    }
  }

  saveNotaryDetails(): void {
    this.notaryDetails = new Notary(0, this.notaryForm.value.notary,
      0, null, this.notaryForm.value.nic, this.notaryForm.value.email,
      this.notaryForm.value.dateOfBirth, this.notaryForm.value.mobileNo, this.notaryForm.value.contactNo,
      this.notaryForm.value.permenentAddressInEnglish,
      this.notaryForm.value.permenentAddressInSinhala,
      this.notaryForm.value.permenentAddressInTamil,
      this.notaryForm.value.currentAddressInEnglish,
      this.notaryForm.value.currentAddressInSinhala,
      this.notaryForm.value.currentAddressInTamil,
      this.notaryForm.value.fullNameInEnglish, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.englishNameWithInitials, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.title, null, null,
      this.notaryForm.value.courtZone, this.notaryForm.value.landRegistry, this.dsGnList, this.notaryForm.value.languages,
      this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate, this.notaryForm.value.medium, CommonStatus.PENDING, new Date(),
      this.notaryForm.value.userName, WorkflowStages.REGISTRATION_REQ_INITIALIZED,
      this.notaryForm.value.userName, this.paymentDataValue.paymentId,
      null, null, null, null, this.paymentDataValue, this.notaryForm.value.title);

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.notaryDetails));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.authorizeRequestService.saveNotaryDetails(formData).subscribe(
      (notaryId: any) => {
        this.userId = notaryId;
        if (this.paymentMethod !== PaymentMethod.ONLINE) {
          this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.REGISTRATION_SUCCESS'));
          this.router.navigate(['/login']);
        } else if (this.paymentMethod === PaymentMethod.ONLINE) {
          this.snackBar.success('Notary saved successfully, Proceed to online payment');
          this.isPayment = true;
          this.statusOnlinePayment = true;
        } else {
          this.snackBar.error('Operation failed');
        }
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  private getGnDivisions(dsDivisionId: any): void {
    this.authorizeRequestService.getAllGnDivisionsByDsDivisionId(dsDivisionId).subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
      }
    );
  }

  private getDsDivisions(): void {
    this.authorizeRequestService.getAllDsDivisions().subscribe(
      (data: DsDivision[]) => {
        this.dsDivision = data;
      }
    );
  }

  // getDsDivisions(): void {
  //   this.dsDivisionService.findAll().subscribe(
  //     (data: DsDivision[]) => {
  //       this.dsDivisions = data;
  //     }
  //   );
  // }

  private getJudicialZones(): void {
    this.authorizeRequestService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZones = data;
      }
    );
  }

  public changes($event): void {
    this.authorizeRequestService.getAllGnDivisionsByDsDivisionId(this.notaryForm.value.secretariatDivision).subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
      }
    );
    // @ts-ignore
    //  this.previousSelections[index] = this.notaryForm.value.secretariatDivision;
  }

  private getLandRegistries(id: any): void {
    this.authorizeRequestService.getLandRegistriesByJudicialId(id).subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    );
  }

  private getNameTitles(): void {
    this.authorizeRequestService.findAllNameTitle().subscribe(
      (data: NameTitleDTO[]) => {
        this.nameTitles = data;
      }
    );
  }

  get FormControls() {
    return this.notaryForm.controls;
  }

  inputEmail($event): void {
    this.notaryForm.get('userName').setValue(this.notaryForm.get('email').value);
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    // save notary form for online payment with reference no
    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.paymentDataValue = this.paymentDto;
      this.returnURl = 'login';
      this.saveNotaryDetails();
    }
  }

  getPaymentData(paymentData: PaymentResponse) {
    if (this.paymentMethod !== PaymentMethod.ONLINE) {
      this.paymentDto.paymentId = paymentData.paymentId;
      this.paymentDataValue = this.paymentDto;
      this.saveNotaryDetails();
    }
  }

  // base 64 convertion
  getBase64String(url: string): string {
    return btoa(url);
  }

  onRemoveDSDivision(item: NewNotaryDsDivisionDTO, index: any) {
    this.dsDivision[this.dsDivision.indexOf(this.getLocalDSDivisionById(item.dsDivisionId))].selected = false;
    this.dsGnList.splice(index, 1);
  }

  onBack() {
    this.isPayment = false;
    this.reCaptcha.setValue(null);
    this.reCaptcha.updateValueAndValidity();
    this.cdr.detectChanges();
  }
}
