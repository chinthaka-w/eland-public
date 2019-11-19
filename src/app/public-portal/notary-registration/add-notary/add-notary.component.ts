import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../shared/model/notary';
import {NotaryService} from '../../../shared/service/notary-service';
import {GnDivisionService} from '../../../shared/service/gn-division-service';
import {GnDivision} from '../../../shared/model/gn-division';
import {DsDivision} from '../../../shared/model/ds-division';
import {LandRegistry} from '../../../shared/model/land-registry';
import {DsDivisionService} from '../../../shared/service/ds-division-service';
import {LandRegistryService} from '../../../shared/service/land-registry-service';
import {NewNotaryGnDivisionDTO} from '../../../shared/model/new-notary-gn-division';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {JudicialZoneService} from '../../../shared/service/judicial-zone.service';
import {JudicialZoneModel} from '../../../shared/custom-model/judicial-zone.model';
import {GnDivisionDTO} from '../../../shared/model/gn-division-dto';
import {MatRadioChange} from '@angular/material/radio';
import {DomSanitizer} from '@angular/platform-browser';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';


@Component({
  selector: 'app-add-notary',
  templateUrl: './add-notary.component.html',
  styleUrls: ['./add-notary.component.css']
})

export class AddNotaryComponent implements OnInit {
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

  public notaryForm: FormGroup;
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public landRegistry: LandRegistry[];
  public judicialZones: JudicialZoneModel[];
  public notaryDetails: Notary;
  public gnDivisionDetails: GnDivisionDTO;
  public newNotaryGnDivision: NewNotaryGnDivisionDTO;

  public locationDto: any = {};
  public locationList: NewNotaryGnDivisionDTO[] = [];
  fileUpload: ElementRef;
  fileUploads: ElementRef;
  inputFileName: string;
  constructor(private formBuilder: FormBuilder,
              private notaryService: NotaryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private landRegistryService: LandRegistryService,
              private judicialZoneService: JudicialZoneService,
              private sanitizer: DomSanitizer,
              private tokenStorageService: TokenStorageService) { }

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
      contactNo: new FormControl('', [Validators.required , Validators.pattern(PatternValidation.contactNumberValidation)]),
      landRegistry: new FormControl('', [Validators.required]),
      secretariatDivision: new FormControl('', [Validators.required]),
      gramaNiladhariDivision: new FormControl('', [Validators.required]),
      medium: new FormControl('' , [Validators.required]),
      userName: new FormControl('', [Validators.required]),
    });
    this.getGnDivisions();
    this.getDsDivisions();
    this.getLandRegistries();
    this.getJudicialZones();
    this.locationList.push(this.locationDto);
    this.locationDto = {};
  }

  addLocation() {
    this.locationList.push(this.locationDto);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.locationList.splice(index, 1);
  }

  public onFormSubmit() {
    this.notaryService.findIfNotaryExist(this.notaryForm.value.nic).subscribe(
      (data) => {
        if (data != null) {
          alert('Already Exists...');
        } else {
          this.saveNotaryDetails(this.notaryForm.value.notary, this.notaryForm.value.title, this.notaryForm.value.englishNameWithInitials,
            this.notaryForm.value.sinhalaNameWithInitials, this.notaryForm.value.tamilNameWithInitials, this.notaryForm.value.fullNameInEnglish,
            this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil, this.notaryForm.value.nic,
            this.notaryForm.value.email, this.notaryForm.value.languages, this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate,
            this.notaryForm.value.dateOfBirth, this.notaryForm.value.courtZone, this.notaryForm.value.permenentAddressInEnglish,
            this.notaryForm.value.permenentAddressInSinhala,
            this.notaryForm.value.permenentAddressInTamil, this.notaryForm.value.currentAddressInEnglish, this.notaryForm.value.currentAddressInSinhala, this.notaryForm.value.currentAddressInTamil,
            this.notaryForm.value.mobileNo, this.notaryForm.value.contactNo, this.notaryForm.value.landRegistry, this.notaryForm.value.secretariatDivision,
            this.notaryForm.value.gramaNiladhariDivision, this.notaryForm.value.medium, this.notaryForm.value.userName);
        }
      }
    );
  }

  saveNotaryDetails(notaryId: number, titleEng: string, initialsEng: string, initialsSin: string, initialsTam: string, fullNameEng: string,
                    fullNameSin: string, fullNameTam: string, nic: string, email: string, languages: number, dateOfEnrolment: Date, dateOfPassed: Date,
                    dateOfBirth: Date, judicialZone: number, permenentAddressEng: string, permenentAddressSin: string, permenentAddressTam: string,
                    currentAddressEng: string, currentAddressSin: string, currentAddressTam: string, mobileNo: string, telephoneNo: string, landRegistryId: number,
                    divisionSecretariatDivision: number, gramaNiladhariDivision: number, medium: number, userName: string): void {

    this.gnDivisionDetails = new GnDivisionDTO(gramaNiladhariDivision, null, null, null, null, null, divisionSecretariatDivision, 'ACT', null);
    this.newNotaryGnDivision = new NewNotaryGnDivisionDTO( divisionSecretariatDivision, 'asd', [this.gnDivisionDetails]);
    this.notaryDetails = new Notary(0, notaryId, 0, null, nic, email, dateOfBirth, mobileNo, telephoneNo,
      permenentAddressEng, currentAddressEng, permenentAddressSin, currentAddressSin, permenentAddressTam, currentAddressTam,
      fullNameEng, fullNameSin, fullNameTam, initialsEng, initialsSin, initialsTam, titleEng, 'Miss', 'Ms',
      1, landRegistryId, [this.newNotaryGnDivision], languages, dateOfEnrolment, dateOfPassed, medium, 'status', new Date(),  this.tokenStorageService.getUserObjectToken().username, userName);
    this.notaryService.setNotaryDetails(this.notaryDetails);
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
      (data: LandRegistry[]) => {
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
    if (event.value === '1') {
      this.notaryForm = this.formBuilder.group({
        notary: new FormControl('', [Validators.required]),
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
        userName: new FormControl('', [Validators.required]),
      });
    } else if (event.value === '2') {

      this.notaryForm = this.formBuilder.group({
        notary: new FormControl('', [Validators.required]),
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
    } else if (event.value === '3') {

      this.notaryForm = this.formBuilder.group({
        notary: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        englishNameWithInitials: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        sinhalaNameWithInitials: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        tamilNameWithInitials: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInEnglish: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInSinhala: new FormControl('', [Validators.pattern(PatternValidation.nameValidation)]),
        fullNameInTamil: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
        nic: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
        email: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
        languages: new FormControl(event.value),
        enrolledDate: new FormControl(new Date(), [Validators.required]),
        passedDate: new FormControl(new Date(), [Validators.required]),
        dateOfBirth: new FormControl(new Date(), [Validators.required]),
        courtZone: new FormControl('', [Validators.required]),
        permenentAddressInEnglish: new FormControl('', [Validators.required]),
        permenentAddressInSinhala: new FormControl(''),
        permenentAddressInTamil: new FormControl('' , [Validators.required]),
        currentAddressInEnglish: new FormControl('', [Validators.required]),
        currentAddressInSinhala: new FormControl(''),
        currentAddressInTamil: new FormControl('' , [Validators.required]),
        mobileNo: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
        contactNo: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
        landRegistry: new FormControl('', [Validators.required]),
        secretariatDivision: new FormControl('', [Validators.required]),
        gramaNiladhariDivision: new FormControl('', [Validators.required]),
        medium: new FormControl('', [Validators.required]),
        userName: new FormControl('', [Validators.required]),
      });
    }
  }
  onClick(event) {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  onInput(event) {

  }

  onFileSelected(event) {
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    console.log('event::::::', event);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
      this.files.push(files[i]);
    }
  }

  removeFile(event, file) {
    let ix;
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1);
      this.clearInputElement();
    }
  }

  onClicks(event) {
    if (this.fileUploads) {
      this.fileUploads.nativeElement.click();
    }
  }

  onInputs(event) {

  }

  onFileSelecteds(event) {
    const file = event.dataTransfer ? event.dataTransfer.file : event.target.file;
    console.log('event::::::', event);
    for (let i = 0; i < file.length; i++) {
      const filesList = file[i];
      filesList.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file[i])));
      this.files.push(file[i]);
    }
  }

  removeFiles(event, file) {
    let ix;
    if (this.file && -1 !== (ix = this.file.indexOf(file))) {
      this.file.splice(ix, 1);
      this.clearInputElements();
    }
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = '';
  }

  clearInputElements() {
    this.fileUploads.nativeElement.value = '';
  }
}
