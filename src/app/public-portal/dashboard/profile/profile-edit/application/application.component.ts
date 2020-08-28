import { Router } from '@angular/router';
import { SystemService } from './../../../../../shared/service/system.service';
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
import {SysMethodsService} from '../../../../../shared/service/sys-methods.service';

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
  disableSubmit = false;
  firstValue: any;
  lastValue: any;
  showSpinner = false;

  constructor(private sessionService: SessionService,
              private notaryService: NotaryService,
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder,
              private systemService: SystemService,
              private sysMethodsService: SysMethodsService,
              private router: Router) { }

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      fNameEng: new FormControl({value: '', disabled: true }),
      fNameSin: new FormControl({value: '', disabled: true}),
      fNameTam: new FormControl({value: '', disabled: true}),
      nameIniEng: new FormControl(''),
      nameIniSin: new FormControl(''),
      nameIniTam: new FormControl(''),
      perAddEng: new FormControl('', [
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)
      ]),
      perAddSin: new FormControl('', [ Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      perAddTam: new FormControl('', [ Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      curAddressEng: new FormControl('', [
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)
      ]),
      curAddressSin: new FormControl('', [Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      curAddressTam: new FormControl('', [ Validators.pattern(PatternValidation.ADDRESS_PATTERN)]),
      isWarLang: new FormControl(''),
      dob: new FormControl(''),
      nic: new FormControl(''),
      contact: new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.contactNumberValidation)]),
      mobile: new FormControl('', [ Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl('', [ Validators.required,this.sysMethodsService.noWhitespaceValidator, Validators.pattern(PatternValidation.emailValidation)]),
      judicial: new FormControl(''),
      lRegistry: new FormControl(''),
      clerkName: new FormControl(''),
      clerkNic: new FormControl(''),

    });
    this.notaryId = this.sessionService.getUser().id;
    this.getNotaryDetails();
     // alert(this.x1.perAddEng);
    this.requestForm.valueChanges.subscribe(x => {
      this.lastValue = x;
    });


  //  this.comparevaluesOfform();
  }
   comparevaluesOfform(): boolean {
    if (this.firstValue.perAddEng === this.lastValue.perAddEng) {
      console.log(this.lastValue.perAddEng + 'and ' + this.lastValue.perAddEng);
    }
    if (this.firstValue.perAddEng === this.lastValue.perAddEng
        && this.firstValue.perAddSin === this.lastValue.perAddSin
        && this.firstValue.perAddTam === this.lastValue.perAddTam
        && this.firstValue.curAddressEng === this.lastValue.curAddressEng
        && this.firstValue.curAddressSin === this.lastValue.curAddressSin
        && this.firstValue.curAddressTam === this.lastValue.curAddressTam
        && this.firstValue.contact === this.lastValue.contact
        && this.firstValue.mobile === this.lastValue.mobile
        && this.firstValue.email === this.lastValue.email ) {
        return false;

      } else {
        return true;
      }

   }

   compareEmptyValues(): boolean {
    if ((this.requestForm.value.perAddEng === null || this.requestForm.value.perAddEng === '') &&
      (this.requestForm.value.perAddSin === null || this.requestForm.value.perAddSin === '') &&
      (this.requestForm.value.perAddTam === null || this.requestForm.value.perAddTam === '' )) {
      this.snackBar.warn('Please fill Permanent address ');
      return false;
    } else if ((this.requestForm.value.curAddressEng === null || this.requestForm.value.curAddressEng === '') &&
      (this.requestForm.value.curAddressSin === null || this.requestForm.value.curAddressSin === '') &&
      (this.requestForm.value.curAddressTam === null || this.requestForm.value.curAddressTam === '')) {
      this.snackBar.warn('Please fill Current address ');
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
        this.firstValue = this.requestForm.value;
      }
    );
  }

  submitForm() {
    this.submitted = true;
    if (this.requestForm.invalid) {
      return;
    }
    if (this.comparevaluesOfform()) {
            if (this.compareEmptyValues()) {
              this.showSpinner = true;
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
                  this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
                  // this.requestForm.reset();
                  this.disableSubmit = true;
                  this.showSpinner = false;
                },
                error => {
                  this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
                  this.showSpinner = false;
                },
                () => {
                  this.router.navigate(['/dashboard']);
                }
              );
            }
    } else {

      this.snackBar.warn(this.systemService.getTranslation('EDIT_PROFILE.VALIDATION.NO_FIELD_TO_UPDATE'));
    }

  }

  get f() {
    return this.requestForm.controls;
  }

}
