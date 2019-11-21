import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PatternValidation} from "../../../../shared/enum/pattern-validation.enum";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {NewNotaryViewDto} from "../../../../shared/dto/new-notary-view.dto";
import {NewNotaryRegistrationRequest} from "../../../../shared/dto/new-notary-registration-request.model";

@Component({
  selector: 'app-notary-application',
  templateUrl: './notary-application.component.html',
  styleUrls: ['./notary-application.component.css']
})
export class NotaryApplicationComponent implements OnInit {
  public notaryForm: FormGroup;
  public notaryDetails: NewNotaryViewDto;
  public requestDetails:NewNotaryRegistrationRequest[];
  public date: Date;

  constructor(private formBuilder: FormBuilder,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService) { }

  ngOnInit() {
    this.notaryDetails = this.newNotaryDataVarificationService.ViewNotaryDetails();
    if(this.newNotaryDataVarificationService.ViewRequestDetails() != null){
      this.requestDetails = this.newNotaryDataVarificationService.ViewRequestDetails();
    }
    console.log(this.notaryDetails.nic);

    this.notaryForm = this.formBuilder.group({
      title: new FormControl(this.notaryDetails.nameWithInitial.english, [Validators.required]),
      englishNameWithInitials: new FormControl(this.notaryDetails.nameWithInitial.english, [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      sinhalaNameWithInitials: new FormControl(this.notaryDetails.nameWithInitial.sinhala, [ Validators.pattern(PatternValidation.nameValidation)]),
      tamilNameWithInitials: new FormControl(this.notaryDetails.nameWithInitial.tamil, [ Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInEnglish: new FormControl(this.notaryDetails.fullName.english, [Validators.required , Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInSinhala: new FormControl(this.notaryDetails.fullName.sinhala, [ Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInTamil: new FormControl(this.notaryDetails.fullName.tamil, [ Validators.pattern(PatternValidation.nameValidation)]),
      nic: new FormControl(this.notaryDetails.nic, [Validators.required , Validators.pattern(PatternValidation.nicValidation)]),
      email: new FormControl(this.notaryDetails.email, [Validators.required , Validators.pattern(PatternValidation.emailValidation)]),
      languages: new FormControl(this.notaryDetails.language ),
      enrolledDate: new FormControl(this.notaryDetails.enrolledDate, [Validators.required]),
      passedDate: new FormControl(this.notaryDetails.subjectPassedDate, [Validators.required]),
      dateOfBirth: new FormControl(this.notaryDetails.dateOfBirth, [Validators.required]),
      courtZone: new FormControl(this.notaryDetails.judicialZone, [Validators.required]),
      permenentAddressInEnglish: new FormControl(this.notaryDetails.permanentAddress.english, [Validators.required]),
      permenentAddressInSinhala: new FormControl(this.notaryDetails.permanentAddress.sinhala),
      permenentAddressInTamil: new FormControl(this.notaryDetails.permanentAddress.tamil),
      currentAddressInEnglish: new FormControl(this.notaryDetails.currantAddress.english, [Validators.required]),
      currentAddressInSinhala: new FormControl(this.notaryDetails.currantAddress.sinhala),
      currentAddressInTamil: new FormControl(this.notaryDetails.currantAddress.tamil),
      mobileNo: new FormControl(this.notaryDetails.mobile, [Validators.pattern(PatternValidation.contactNumberValidation)]),
      contactNo: new FormControl(this.notaryDetails.contactNo, [Validators.required , Validators.pattern(PatternValidation.contactNumberValidation)]),
      landRegistry: new FormControl(this.notaryDetails.landRegistry,[Validators.required]),
      secretariatDivision: new FormControl(this.notaryDetails.newNotaryDsDivisionDTO.dsDivisionDescription, [Validators.required]),
      gramaNiladhariDivision: new FormControl(this.notaryDetails.newNotaryDsDivisionDTO.gnDivisions, [Validators.required]),
      medium: new FormControl(this.notaryDetails.subjectMedium , [Validators.required]),
      userName: new FormControl(this.notaryDetails.lastUpdatedUser, [Validators.required]),
    });

  }

}
