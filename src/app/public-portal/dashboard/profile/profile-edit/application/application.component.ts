import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../../../shared/service/session.service';
import {NotaryService} from '../../../../../shared/service/notary-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../../../shared/dto/notary.model';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {JudicialChange} from '../../../../../shared/dto/judicial-change-model';
import {WorkflowStages} from '../../../../../shared/enum/workflow-stages.enum';
import {PatternValidation} from '../../../../../shared/enum/pattern-validation.enum';
import {unescapeIdentifier} from '@angular/compiler';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  public notaryId: number;
  requestForm: FormGroup;
  notaryDetails: Notary;
  public notary: Notary;
  submitted = false;
  x1: any;
  x2: any;
  constructor(private sessionService: SessionService,
              private notaryService: NotaryService,
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      fNameEng: new FormControl(''),
      fNameSin: new FormControl(''),
      fNameTam: new FormControl(''),
      nameIniEng: new FormControl(''),
      nameIniSin: new FormControl(''),
      nameIniTam: new FormControl(''),
      perAddEng: new FormControl(''),
      perAddSin: new FormControl(''),
      perAddTam: new FormControl(''),
      curAddressEng: new FormControl(''),
      curAddressSin: new FormControl(''),
      curAddressTam: new FormControl(''),
      isWarLang: new FormControl(''),
      dob: new FormControl(''),
      nic: new FormControl(''),
      contact: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl('', [ Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
      judicial: new FormControl(''),
      lRegistry: new FormControl(''),
      clerkName: new FormControl(''),
      clerkNic: new FormControl(''),

    });
    this.notaryId = this.sessionService.getUser().id;
    this.getNotaryDetails();
     // alert(this.x1.perAddEng);
    this.requestForm.valueChanges.subscribe(x => {
      this.x2 = x;
    });


  //  this.comparevaluesOfform();
  }
   comparevaluesOfform(): boolean {
    if (this.x1.perAddEng === this.x2.perAddEng) {
      console.log(this.x1.perAddEng + 'and ' + this.x2.perAddEng);
    }

    if (this.x1.perAddEng === this.x2.perAddEng
        && this.x1.perAddSin === this.x2.perAddSin
        && this.x1.perAddTam === this.x2.perAddTam
        && this.x1.curAddressEng === this.x2.curAddressEng
        && this.x1.curAddressSin === this.x2.curAddressSin
        && this.x1.curAddressTam === this.x2.curAddressTam
        && this.x1.contact === this.x2.contact
        && this.x1.mobile === this.x2.mobile
        && this.x1.email === this.x2.email ) {
        return false;

      } else {
        return true;
      }

   }
  private getNotaryDetails(): void {
    this.notaryService.getNotary(this.notaryId).subscribe(
      (data: Notary) => {
        this.notaryDetails = data;
        this.requestForm.patchValue(
          {
            fNameEng: this.notaryDetails.fullNameEng,
            fNameSin: this.notaryDetails.fullNameSin,
            fNameTam: this.notaryDetails.fullNameTam,
            perAddEng: this.notaryDetails.permanentAddressEng,
            perAddSin: this.notaryDetails.permanentAddressSin,
            perAddTam: this.notaryDetails.permanentAddressTam,
            curAddressEng: this.notaryDetails.currantAddressEng,
            curAddressSin: this.notaryDetails.currantAddressSin,
            curAddressTam: this.notaryDetails.currantAddressTam,
            dob: this.notaryDetails.dateOfBirth,
            nic: this.notaryDetails.nic,
            contact: this.notaryDetails.contactNo,
            mobile: this.notaryDetails.mobile,
            email: this.notaryDetails.email,
            judicial: this.notaryDetails.judicialZoneDesc,
            lRegistry: this.notaryDetails.landRegistryDesc,
            enrollDate: this.notaryDetails.enrolledDate,
            passDate: this.notaryDetails.subjectPassedDate,
            title: this.notaryDetails.titleEng,
          }
        );
        this.x1 = this.requestForm.value;
      }
    );
  }

  submitForm() {
    this.submitted = true;
    if (this.requestForm.invalid) {
      return;
    }
    if (this.comparevaluesOfform()) {

      this.notary = new Notary(this.notaryId, null, 0, null, this.requestForm.value.clerkNic, this.requestForm.value.email,
        null, this.requestForm.value.mobile,  this.requestForm.value.contact,
        this.requestForm.value.perAddEng,  this.requestForm.value.perAddSin,  this.requestForm.value.perAddTam,
        this.requestForm.value.curAddressEng, this.requestForm.value.curAddressSin, this.requestForm.value.curAddressTam,
        this.requestForm.value.fNameEng, this.requestForm.value.fNameSin, this.requestForm.value.fNameTam,
        null,  null, null,
        null, null, null,
        null, null, null, null,
        null, null, null, null, new Date(),
        null, null, null, null, null, null, this.requestForm.value.clerkName, this.requestForm.value.clerkNic, null, null);


      this.notaryService.editProfile(this.notary).subscribe(
        (success: string) => {
          this.snackBar.success('Submitted the profile edit request successfully!');
          // this.requestForm.reset();
        },
        error => {
          this.snackBar.error('Failed');
        }
      );

    } else {

      this.snackBar.warn('There are no fields to update!');
    }

  }

  get f() {
    return this.requestForm.controls;
  }

}
