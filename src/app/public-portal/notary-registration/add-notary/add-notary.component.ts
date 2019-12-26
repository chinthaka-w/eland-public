import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
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
import {SnackBarService} from "../../../shared/service/snack-bar.service";
import {PaymentService} from "../../../shared/service/payment.service";
import {PaymentComponent} from "../../../shared/components/payment/payment.component";
import {PaymentMethodComponent} from "../../../shared/components/payment/payment-method/payment-method.component";
import {Workflow} from "../../../shared/enum/workflow.enum";
import {Parameters} from "../../../shared/enum/parameters.enum";
import {PaymentResponse} from "../../../shared/dto/payment-response.model";
import {WorkflowStageDocDto} from "../../../shared/dto/workflow-stage-doc.dto";
import {DocumentDto} from "../../../shared/dto/document-list";
import {WorkflowStages} from "../../../shared/enum/workflow-stages.enum";
import {SupportingDocService} from "../../../shared/service/supporting-doc.service";
import {Languages} from "../../../shared/enum/languages.enum";

@Component({
  selector: 'app-add-notary',
  templateUrl: './add-notary.component.html',
  styleUrls: ['./add-notary.component.css']
})

export class AddNotaryComponent implements OnInit {
  Parameters = Parameters;
  WorkflowCode = Workflow;

  public isContinueToPayment: boolean = false;
  public paymentResponse = new PaymentResponse;
  languages = Languages;


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
  @ViewChild(PaymentComponent,{static: false}) paymentComponent: PaymentComponent;
  @ViewChild(PaymentMethodComponent,{static: false}) paymentMethodComponent: PaymentMethodComponent;
  public payment: any;
  public paymentDataValue: number;

  public notaryForm: FormGroup;
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public landRegistry: LandRegistryModel[];
  public judicialZones: JudicialZoneModel[];
  public notaryDetails: Notary;
  public previousSelections: any[] = [];
  public isSelected: boolean;
  public disabled: boolean = false;

  public docList: WorkflowStageDocDto[];
  public documentList: DocumentDto[] = [];

  public locationDto: any = {};
  // public locationList: any[] = [];
  public locationList:FormArray;


  public dsGnList: NewNotaryDsDivisionDTO[] = [];
  public gnDivi: GnDivisionDTO[] = [];

  isPayment: boolean = false;
  isPaymentMethod: boolean = false;
  isNotaryRegistration: boolean = false;


  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private landRegistryService: LandRegistryService,
              private judicialZoneService: JudicialZoneService,
              private sanitizer: DomSanitizer,
              private tokenStorageService: TokenStorageService,
              private snackBar: SnackBarService,
              private paymentService: PaymentService,
              private documetService: SupportingDocService) { }

  ngOnInit() {
    this.notaryForm = this.formBuilder.group({
      notary: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      englishNameWithInitials: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      sinhalaNameWithInitials: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      tamilNameWithInitials: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInEnglish: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInSinhala: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInTamil: new FormControl('', [ Validators.pattern(PatternValidation.nameValidation)]),
      nic: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.nicValidation)]),
      email: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.emailValidation)]),
      languages: new FormControl('' ),
      enrolledDate: new FormControl(new Date(), [Validators.required]),
      passedDate: new FormControl(new Date(), [Validators.required]),
      dateOfBirth: new FormControl(new Date(), [Validators.required]),
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
      medium: new FormControl('' , [Validators.required]),
      recaptcha: new FormControl(null, Validators.required),
      userName: new FormControl('', [Validators.required]),
      locationList:this.formBuilder.array([ this.createItem() ])
    });
    this.getGnDivisions();
    this.getDsDivisions();
    this.getLandRegistries();
    this.getJudicialZones();
    this.getDocumentList();

    // this.locationList.push(this.locationDto);


    // this.locationList = this.notaryForm.get('locationList') as FormArray;
    // this.locationList.push(this.createItem());


    this.previousSelections.push(-1);
    this.locationDto = {};
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      ds: '',
      gn: '',
    });
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
    // this.locationList.push(this.locationDto);
    // this.locationList.push({});
    
    // this.previousSelections.push(-1);
    // this.locationDto = {};
    // // this.notaryForm.get("secretariatDivision").reset();


    this.locationList = this.notaryForm.get('locationList') as FormArray;
    this.locationList.push(this.createItem());
  }

  removeLocation(index) {
    // this.dsDivision.forEach(gsDivision => {
    //   if (gsDivision.dsDivisionId == this.locationList[index].gsDivision) {
    //     this.isSelected = false;
    //   }
    // });
    this.locationList = this.notaryForm.get('locationList') as FormArray;
    this.locationList.removeAt(index);
    this.previousSelections.splice(index, 1);
  }

  selectGnDivision(gsDivisionId, index) {
    const gnModel: GnDivisionDTO = new GnDivisionDTO(gsDivisionId[0],null,null,this.notaryForm.value.secretariatDivision,null,null,this.notaryForm.value.secretariatDivision,null,null);
    this.gnDivi.push(gnModel);

    const model: NewNotaryDsDivisionDTO = new NewNotaryDsDivisionDTO(this.notaryForm.value.secretariatDivision,this.notaryForm.value.secretariatDivision,this.gnDivi);
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
    this.notaryService.findIfNotaryExist(this.notaryForm.value.nic).subscribe(
      (data) => {
        if (data != null) {
          this.snackBar.warn("Already Exist")
        } else {
          this.isPayment = true;
          this.isPaymentMethod = false;
        }
      });
  }

    saveNotaryDetails(): void {
    this.notaryDetails = new Notary(0, this.notaryForm.value.notary, 0, null, this.notaryForm.value.nic, this.notaryForm.value.email,
      this.notaryForm.value.dateOfBirth, this.notaryForm.value.mobileNo,  this.notaryForm.value.contactNo,
      this.notaryForm.value.permenentAddressInEnglish, this.notaryForm.value.currentAddressInEnglish, this.notaryForm.value.permenentAddressInSinhala,
      this.notaryForm.value.currentAddressInSinhala,  this.notaryForm.value.permenentAddressInTamil, this.notaryForm.value.currentAddressInTamil,
      this.notaryForm.value.fullNameInEnglish, this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.englishNameWithInitials,   this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil,
      this.notaryForm.value.title, 'Miss', 'Ms',
      this.notaryForm.value.courtZone, this.notaryForm.value.landRegistry, this.dsGnList, this.notaryForm.value.languages,
      this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate, this.notaryForm.value.medium, 'status', new Date(), this.notaryForm.value.userName, WorkflowStages.REGISTRATION_REQ_INITIALIZED, this.notaryForm.value.userName,this.paymentDataValue);

      const formData = new FormData();
      formData.append('data', JSON.stringify(this.notaryDetails));
      this.documentList.forEach(doc => {
        formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
      });

    this.notaryService.saveNotaryDetails(formData).subscribe(
      (success: string) => {
        this.snackBar.success('Notary Registration Success');
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

  onChange(event: MatRadioChange) {
    if (event.value == this.languages.SINHALA) {
      this.notaryForm = this.formBuilder.group({
        notary: new FormControl(this.notaryForm.value.notary, [Validators.required]),
        title: new FormControl('', [Validators.required]),
        englishNameWithInitials: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        sinhalaNameWithInitials: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        tamilNameWithInitials: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInEnglish: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInSinhala: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInTamil: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        nic: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
        email: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
        languages: new FormControl(event.value),
        enrolledDate: new FormControl(new Date(), [Validators.required]),
        passedDate: new FormControl(new Date(), [Validators.required]),
        dateOfBirth: new FormControl(new Date(), [Validators.required]),
        courtZone: new FormControl('', [Validators.required]),
        permenentAddressInEnglish: new FormControl('', [Validators.required]),
        permenentAddressInSinhala: new FormControl('', [Validators.required]),
        permenentAddressInTamil: new FormControl(''),
        currentAddressInEnglish: new FormControl('', [Validators.required]),
        currentAddressInSinhala: new FormControl('', [Validators.required]),
        currentAddressInTamil: new FormControl(''),
        mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
        contactNo: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
        landRegistry: new FormControl('', [Validators.required]),
        secretariatDivision: new FormControl('', [Validators.required]),
        gramaNiladhariDivision: new FormControl('', [Validators.required]),
        medium: new FormControl('', [Validators.required]),
        recaptcha: new FormControl(null, Validators.required),
        userName: new FormControl('', [Validators.required]),
      });
    } else if (event.value == this.languages.TAMIL) {

      this.notaryForm = this.formBuilder.group({
        notary: new FormControl(this.notaryForm.value.notary, [Validators.required]),
        title: new FormControl('', [Validators.required]),
        englishNameWithInitials: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        sinhalaNameWithInitials: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        tamilNameWithInitials: new FormControl('', [Validators.required,Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInEnglish: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInSinhala: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInTamil: new FormControl('', [Validators.required,Validators.pattern(PatternValidation.nameValidation)]),
        nic: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
        email: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
        languages: new FormControl(event.value),
        enrolledDate: new FormControl(new Date(), [Validators.required]),
        passedDate: new FormControl(new Date(), [Validators.required]),
        dateOfBirth: new FormControl(new Date(), [Validators.required]),
        courtZone: new FormControl('', [Validators.required]),
        permenentAddressInEnglish: new FormControl('', [Validators.required]),
        permenentAddressInSinhala: new FormControl(''),
        permenentAddressInTamil: new FormControl('',[Validators.required]),
        currentAddressInEnglish: new FormControl('', [Validators.required]),
        currentAddressInSinhala: new FormControl(''),
        currentAddressInTamil: new FormControl('',[Validators.required]),
        mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
        contactNo: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
        landRegistry: new FormControl('', [Validators.required]),
        secretariatDivision: new FormControl('', [Validators.required]),
        gramaNiladhariDivision: new FormControl('', [Validators.required]),
        medium: new FormControl('', [Validators.required]),
        recaptcha: new FormControl(null, Validators.required),
        userName: new FormControl('', [Validators.required]),
      });
    } else if (event.value == this.languages.ENGLISH) {

      this.notaryForm = this.formBuilder.group({
        notary: new FormControl(this.notaryForm.value.notary, [Validators.required]),
        title: new FormControl('', [Validators.required]),
        englishNameWithInitials: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        sinhalaNameWithInitials: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        tamilNameWithInitials: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInEnglish: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInSinhala: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInTamil: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        nic: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
        email: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
        languages: new FormControl(event.value),
        enrolledDate: new FormControl(new Date(), [Validators.required]),
        passedDate: new FormControl(new Date(), [Validators.required]),
        dateOfBirth: new FormControl(new Date(), [Validators.required]),
        courtZone: new FormControl('', [Validators.required]),
        permenentAddressInEnglish: new FormControl('', [Validators.required]),
        permenentAddressInSinhala: new FormControl(''),
        permenentAddressInTamil: new FormControl('' ),
        currentAddressInEnglish: new FormControl('', [Validators.required]),
        currentAddressInSinhala: new FormControl(''),
        currentAddressInTamil: new FormControl('' ),
        mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
        contactNo: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
        landRegistry: new FormControl('', [Validators.required]),
        secretariatDivision: new FormControl('', [Validators.required]),
        gramaNiladhariDivision: new FormControl('', [Validators.required]),
        medium: new FormControl('', [Validators.required]),
        recaptcha: new FormControl(null, Validators.required),
        userName: new FormControl('', [Validators.required]),
      });
    }
  }


  getPaymentData(paymentData: PaymentResponse){
    this.isPayment = false;
    this.isPaymentMethod = true;
    this.paymentDataValue = paymentData.paymentId;
    this.snackBar.success("Payment Success");
    this.saveNotaryDetails();
    this.isNotaryRegistration = true;
  }

}
