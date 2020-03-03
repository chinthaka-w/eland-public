import { Component, OnInit } from '@angular/core';
import {SessionService} from '../../../../../shared/service/session.service';
import {NotaryService} from '../../../../../shared/service/notary-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../../../shared/dto/notary.model';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {JudicialChange} from '../../../../../shared/dto/judicial-change-model';
import {WorkflowStages} from '../../../../../shared/enum/workflow-stages.enum';

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
  submitted: boolean = false;

  constructor(private sessionService: SessionService,
              private notaryService: NotaryService,
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      fNameEng: new FormControl(""),
      fNameSin: new FormControl(""),
      fNameTam: new FormControl(""),
      nameIniEng: new FormControl(""),
      nameIniSin: new FormControl(""),
      nameIniTam: new FormControl(""),
      perAddEng: new FormControl("" ),
      perAddSin: new FormControl(""),
      perAddTam: new FormControl(""),
      curAddEng: new FormControl(""),
      curAddSin: new FormControl(""),
      curAddTam: new FormControl(""),
      isWarLang: new FormControl(""),
      dob: new FormControl(""),
      nic: new FormControl(""),
      contact: new FormControl(""),
      mobile: new FormControl(""),
      email: new FormControl(""),
      judicial: new FormControl(""),
      lRegistry: new FormControl(""),
      clerkName: new FormControl(""),
      clerkNic: new FormControl(""),

    });
    this.notaryId = this.sessionService.getUser().id;
    this.getNotaryDetails();
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
            curAddEng: this.notaryDetails.currantAddressEng,
            curAddSin: this.notaryDetails.currantAddressSin,
            curAddTam: this.notaryDetails.currantAddressTam,
            dob: this.notaryDetails.dateOfBirth,
            nic: this.notaryDetails.nic,
            contact: this.notaryDetails.contactNo,
            mobile : this.notaryDetails.mobile,
            email: this.notaryDetails.email,
            judicial: this.notaryDetails.judicialZoneDesc,
            lRegistry: this.notaryDetails.landRegistryDesc,
            enrollDate: this.notaryDetails.enrolledDate,
            passDate: this.notaryDetails.subjectPassedDate,
            title: this.notaryDetails.titleEng,
          }
        );

      }
    );
  }

  submitForm() {
    this.submitted = true;
    if (this.requestForm.invalid) {
      return;
    }
    this.notary = new Notary(this.notaryId, null, 0, null, this.requestForm.value.clerkNic, this.requestForm.value.email,
      null, this.requestForm.value.mobile,  this.requestForm.value.contact,
      this.requestForm.value.perAddEng, this.requestForm.value.curAddEng, this.requestForm.value.perAddSin,
      this.requestForm.value.curAddSin,  this.requestForm.value.perAddTam, this.requestForm.value.curAddTam,
      null, null, null,
      null,  null, null,
      null, null, null,
      null, null, null, null,
      null, null, null, null, new Date(),
      null, null, null,null,null,null,this.requestForm.value.clerkName,this.requestForm.value.clerkNic,null);


    this.notaryService.editProfile(this.notary).subscribe(
      (success: string) => {
        this.snackBar.success('Judicial Change Request Success');
        this.requestForm.reset();
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  get f() {
    return this.requestForm.controls;
  }

}
