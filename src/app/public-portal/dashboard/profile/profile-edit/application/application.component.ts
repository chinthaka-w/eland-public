import { Component, OnInit } from '@angular/core';
import {SessionService} from '../../../../../shared/service/session.service';
import {NotaryService} from '../../../../../shared/service/notary-service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Notary} from '../../../../../shared/dto/notary.model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  public notaryId: number;
  requestForm: FormGroup;
  notaryDetails: Notary;

  constructor(private sessionService: SessionService, private notaryService: NotaryService) { }

  ngOnInit() {
    this.requestForm = new FormGroup({
      title: new FormControl(""),
      fNameEng: new FormControl(""),
      fNameSin: new FormControl(""),
      fNameTam: new FormControl(""),
      nameIniEng: new FormControl(""),
      nameIniSin: new FormControl(""),
      nameIniTam: new FormControl(""),
      perAddEng: new FormControl("" ),
      perAddSin: new FormControl(""),
      perAddTam: new FormControl(""),
      CurAddEng: new FormControl(""),
      CurAddSin: new FormControl(""),
      CurAddTam: new FormControl(""),
      isWarLang: new FormControl(""),
      dob: new FormControl(""),
      nic: new FormControl(""),
      contact: new FormControl(""),
      mobile: new FormControl(""),
      email: new FormControl(""),
      judicial: new FormControl(""),
      lRegistry: new FormControl(""),
      enrollDate: new FormControl(""),
      passDate: new FormControl(""),

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
            nameIniEng: this.notaryDetails.nameWithInitialEng,
            nameIniSin: this.notaryDetails.nameWithInitialSin,
            nameIniTam: this.notaryDetails.nameWithInitialTam,
            perAddEng: this.notaryDetails.permanentAddressEng,
            perAddSin: this.notaryDetails.permanentAddressSin,
            perAddTam: this.notaryDetails.permanentAddressTam,
            CurAddEng: this.notaryDetails.currantAddressEng,
            CurAddSin: this.notaryDetails.currantAddressSin,
            CurAddTam: this.notaryDetails.currantAddressTam,
            isWarLang: '',
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

}
