import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
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
  public landRegistry: LandRegistryModel[];
  public judicialZones: JudicialZoneModel[];
  public notaryDetails: Notary;
  public previousSelections: any[] = [];
  public isSelected: boolean;
  public disabled: boolean = false;
  paymentDto: PaymentDto = new PaymentDto();
  selected = 'Notary';

  public docList: WorkflowStageDocDto[];
  public documentList: DocumentDto[] = [];

  public locationDto: any = {};
  public locationList: any[] = [];
  public dsGnList: NewNotaryDsDivisionDTO[] = [];
  public gnDivi: GnDivisionDTO[] = [];

  isPayment: boolean = false;
  isPaymentMethod: boolean = false;

  paymentMethod: number;
  returnURl: string;
  statusOnlinePayment: boolean;

  today: any;
  defaultBirthDay: any;

  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private publicUserService: PublicUserService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private landRegistryService: LandRegistryService,
              private judicialZoneService: JudicialZoneService,
              private sanitizer: DomSanitizer,
              private tokenStorageService: TokenStorageService,
              private snackBar: SnackBarService,
              private paymentService: PaymentService,
              private documetService: SupportingDocService,
              private router: Router) {
    this.today = new Date();

    let dob = new Date();
    dob.setFullYear(dob.getFullYear() - 18);
    this.defaultBirthDay = dob;
  }

  ngOnInit() {
    this.notaryForm = this.formBuilder.group({
      notary: new FormControl(NotaryRegisterType.NOTARY, [Validators.required]),
      title: new FormControl('', [Validators.required]),
      fullNameInEnglish: new FormControl(null, [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInSinhala: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInTamil: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      englishNameWithInitials: new FormControl(null, [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      sinhalaNameWithInitials: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      tamilNameWithInitials: new FormControl(null, [Validators.pattern(PatternValidation.nameValidation)]),
      nic: new FormControl(null, [Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
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


    this.getGnDivisions();
    this.getDsDivisions();
    this.getLandRegistries();
    this.getJudicialZones();
    this.getDocumentList();

    this.locationList.push(this.locationDto);
    this.previousSelections.push(-1);
    this.locationDto = {};
  }

  get languages(): FormControl {
    return this.notaryForm.get('languages') as FormControl;
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

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.publicUserService.checkIfUsernameExists(control.value).pipe(
        map(res => {
          // if res is true, username exists, return true
          return res ? {usernameExists: true} : null;
          // NB: Return null if there is no error
        })
      );
    };
  }


  private getDocumentList(): void {
    this.documetService.getDocuments(Workflow.NOTARY_REGISTRATION).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }


  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }


  addLocation() {
    this.locationList.push(this.locationDto);
    this.previousSelections.push(-1);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.dsDivision.forEach(gsDivision => {
      if (gsDivision.dsDivisionId == this.locationList[index].gsDivision) {
        this.isSelected = false;
      }
    });
    this.locationList.splice(index, 1);
    this.previousSelections.splice(index, 1);
  }

  selectGnDivision(gsDivisionId, index) {
    const gnModel: GnDivisionDTO = new GnDivisionDTO(gsDivisionId[0], null, null, this.notaryForm.value.secretariatDivision, null, null, this.notaryForm.value.secretariatDivision, null, null);
    this.gnDivi.push(gnModel);

    const model: NewNotaryDsDivisionDTO = new NewNotaryDsDivisionDTO(this.notaryForm.value.secretariatDivision, this.notaryForm.value.secretariatDivision, this.gnDivi);
    this.dsGnList.push(model);
  }

  selectGsDivision(dsDivisionId, index) {
    this.dsDivision.forEach(dsDivisions => {
      if (dsDivisions.dsDivisionId == dsDivisionId) {
        this.isSelected = true;
      }
      if (dsDivisions.dsDivisionId == this.previousSelections[index]) {
        this.isSelected = false;
      }
    });
    this.previousSelections[index] = dsDivisionId;
  }

  public onFormSubmit() {
    if (this.notaryForm.invalid) {
      Object.keys(this.notaryForm.controls).forEach(field => {
        const control = this.notaryForm.get(field);
        control.markAsTouched({onlySelf: true});
      });
    }
    else {
      this.notaryService.findIfNotaryExist(this.notaryForm.value.nic).subscribe(
        (data) => {
          if (data != null) {
            this.snackBar.warn('Already Exist')
          } else {
            this.isPayment = true;
            this.isPaymentMethod = false;
          }
        });
    }
  }

  saveNotaryDetails(): void {
    this.notaryDetails = new Notary(0, this.notaryForm.value.notary, 0, null, this.notaryForm.value.nic, this.notaryForm.value.email,
      this.notaryForm.value.dateOfBirth, this.notaryForm.value.mobileNo, this.notaryForm.value.contactNo,
      this.notaryForm.value.permenentAddressInEnglish, this.notaryForm.value.currentAddressInEnglish, this.notaryForm.value.permenentAddressInSinhala,
      this.notaryForm.value.currentAddressInSinhala, this.notaryForm.value.permenentAddressInTamil, this.notaryForm.value.currentAddressInTamil,
      this.notaryForm.value.fullNameInEnglish, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.englishNameWithInitials, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.title, null,null,
      this.notaryForm.value.courtZone, this.notaryForm.value.landRegistry, this.dsGnList, this.notaryForm.value.languages,
      this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate, this.notaryForm.value.medium, 'status', new Date(),
      this.notaryForm.value.userName, WorkflowStages.REGISTRATION_REQ_INITIALIZED, this.notaryForm.value.userName, this.paymentDataValue.paymentId, null, null, null, null, this.paymentDataValue);

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.notaryDetails));
    this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });

    this.notaryService.saveNotaryDetails(formData).subscribe(
      (success: string) => {
        if (this.paymentMethod !== PaymentMethod.ONLINE) {
          this.snackBar.success('Notary Registration Success');
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

  private getGnDivisions(): void {
    this.gnDivisionService.getAllGnDivisions().subscribe(
      (data: GnDivision[]) => {
        this.gnDivision = data;
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
    // @ts-ignore
    //  this.previousSelections[index] = this.notaryForm.value.secretariatDivision;
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
      this.returnURl = this.getBase64String('login');
      this.saveNotaryDetails();
    }
  }

  getPaymentData(paymentData: PaymentResponse) {
    if (this.paymentMethod !== PaymentMethod.ONLINE) {
      this.paymentDto.paymentId = paymentData.paymentId;
      this.paymentDataValue = this.paymentDto;
      this.snackBar.success('Payment Success');
      this.saveNotaryDetails();
    }
  }

  // base 64 convertion
  getBase64String(url: string): string {
    return btoa(url);
  }
}
