import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Notary} from '../../../shared/model/notary';
import {NotaryService} from '../../../shared/service/notary-service';
import {GnDivisionService} from '../../../shared/service/gn-division-service';
import {GnDivision} from '../../../shared/model/gn-division';
import {DsDivision} from '../../../shared/model/ds-division';
import {LandRegistry} from '../../../shared/model/land-registry';
import {DsDivisionService} from '../../../shared/service/ds-division-service';
import {LandRegistryService} from '../../../shared/service/land-registry-service';
import {HttpClient} from '@angular/common/http';
import {NotaryAddressDTO} from '../../../shared/model/new-notary-address';
import {NewNotaryNameDTO} from '../../../shared/model/new-notary-name';
import {NewNotaryGnDivisionDTO} from '../../../shared/model/new-notary-gn-division';
import {NameTitleDTO} from '../../../shared/model/name-title';


@Component({
  selector: 'app-add-notary',
  templateUrl: './add-notary.component.html',
  styleUrls: ['./add-notary.component.css']
})

export class AddNotaryComponent implements OnInit {
  public notaryForm: FormGroup;
  public gnDivision: GnDivision[];
  public dsDivision: DsDivision[];
  public landRegistry: LandRegistry[];
  submitted = false;
  selected: any[];


  uploadSuccess: boolean;
  constructor(private fb: FormBuilder,
              private notaryService: NotaryService,
              private gnDivisionService: GnDivisionService,
              private dsDivisionService: DsDivisionService,
              private landRegistryService: LandRegistryService,
              private http: HttpClient) { }

  ngOnInit() {
    this.notaryForm = new FormGroup({
      notary: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      englishNameWithInitials: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
      sinhalaNameWithInitials: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
      tamilNameWithInitials: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
      fullNameInEnglish: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
      fullNameInSinhala: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
      fullNameInTamil: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$')]),
      nic: new FormControl('', [Validators.required , Validators.pattern('[0-9]{12}|[0-9]{9}[x|X|v|V]$')]),
      email: new FormControl('', [Validators.required , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}')]),
      languages: new FormControl('' , [Validators.required]),
      enrolledDate: new FormControl(new Date(), [Validators.required]),
      passedDate: new FormControl(new Date(), [Validators.required]),
      dateOfBirth: new FormControl(new Date(), [Validators.required]),
      courtZone: new FormControl('', [Validators.required]),
      permenentAddressInEnglish: new FormControl('', [Validators.required]),
      permenentAddressInSinhala: new FormControl('', [Validators.required]),
      permenentAddressInTamil: new FormControl('', [Validators.required]),
      currentAddressInEnglish: new FormControl('', [Validators.required]),
      currentAddressInSinhala: new FormControl('', [Validators.required]),
      currentAddressInTamil: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required , Validators.pattern('(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\\d)\\d{6}$')]),
      contactNo: new FormControl('', [Validators.required , Validators.pattern('(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\\d)\\d{6}$')]),
      landRegistry: new FormControl('', [Validators.required]),
      secretariatDivision: new FormControl('', [Validators.required]),
      gramaNiladhariDivision: new FormControl('', [Validators.required]),
      medium: new FormControl('' , [Validators.required]),
    });
    this.getGnDivisions();
    this.getDsDivisions();
    this.getLandRegistries();
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.notaryForm.controls[controlName].hasError(errorName);
  }

  onFormSubmit(): void {
    this.submitted = true;
    this.saveNotaryDetails(this.notaryForm.value.notary, this.notaryForm.value.title, this.notaryForm.value.englishNameWithInitials,
          this.notaryForm.value.sinhalaNameWithInitials, this.notaryForm.value.tamilNameWithInitials, this.notaryForm.value.fullNameInEnglish,
          this.notaryForm.value.fullNameInSinhala, this.notaryForm.value.fullNameInTamil, this.notaryForm.value.nic,
          this.notaryForm.value.email, this.notaryForm.value.languages, this.notaryForm.value.enrolledDate, this.notaryForm.value.passedDate,
          this.notaryForm.value.dateOfBirth, this.notaryForm.value.courtZone, this.notaryForm.value.permenentAddressInEnglish,
          this.notaryForm.value.permenentAddressInSinhala,
          this.notaryForm.value.permenentAddressInTamil, this.notaryForm.value.currentAddressInEnglish, this.notaryForm.value.currentAddressInSinhala, this.notaryForm.value.currentAddressInTamil,
          this.notaryForm.value.mobileNo, this.notaryForm.value.contactNo, this.notaryForm.value.landRegistry, this.notaryForm.value.secretariatDivision,
          this.notaryForm.value.gramaNiladhariDivision, this.notaryForm.value.medium);

  }

  saveNotaryDetails(notaryId: number, titleEng: number, initialsEng: string, initialsSin: string, initialsTam: string, fullNameEng: string,
                    fullNameSin: string, fullNameTam: string, nic: string, email: string, languages: number, dateOfEnrolment: Date, dateOfPassed: Date,
                    dateOfBirth: Date, judicialZone: number, permenentAddressEng: string, permenentAddressSin: string, permenentAddressTam: string,
                    currentAddressEng: string, currentAddressSin: string, currentAddressTam: string, mobileNo: string, telephoneNo: string, landRegistryId: number,
                    divisionSecretariatDivision: number, gramaNiladhariDivision: number, medium: number): void {

    const nameTitle = new NameTitleDTO(titleEng, 'english', 'sinhala', 'tamil', 'status', new Date(), 'Ishani');

    const newNotaryAddress = new NotaryAddressDTO(0, permenentAddressEng, currentAddressSin, languages, 'status', 0);

    const newNotaryName = new NewNotaryNameDTO(0, fullNameEng, initialsEng, languages, 'status', nameTitle, 0);

    const newNotaryGnDivision = new NewNotaryGnDivisionDTO(0, 'status', new Date(), divisionSecretariatDivision, gramaNiladhariDivision, 0);

    const notary = new Notary(0, 0, null, nic, email, dateOfBirth, mobileNo, telephoneNo, newNotaryAddress, newNotaryName,
      judicialZone, landRegistryId, newNotaryGnDivision, dateOfEnrolment, dateOfPassed, medium, 'status', new Date());
    this.notaryService.saveNotaryDetails(notary).subscribe(
      (success: string) => {
        alert('sucesss....');
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

  private getDsDivisions(): void {
    this.dsDivisionService.getAllDsDivisions().subscribe(
      (data: DsDivision[]) => {
        this.dsDivision = data;
      }
    );
  }

  public change($event): void {
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
}
