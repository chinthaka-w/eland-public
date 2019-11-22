import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PatternValidation} from "../../../../shared/enum/pattern-validation.enum";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {NewNotaryViewDto} from "../../../../shared/dto/new-notary-view.dto";
import {NewNotaryRegistrationRequest} from "../../../../shared/dto/new-notary-registration-request.model";
import {NewNotaryGnDivisionDTO} from "../../../../shared/dto/new-notary-gn-division.model";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";

@Component({
  selector: 'app-notary-application',
  templateUrl: './notary-application.component.html',
  styleUrls: ['./notary-application.component.css']
})
export class NotaryApplicationComponent implements OnInit {
  public notaryForm: FormGroup;
  public notaryDetails: NewNotaryViewDto;
  public requestDetails:NewNotaryRegistrationRequest[];
  searchType: NewNotaryRequestsCategorySearchDto ;
  dsGnDivisions: NewNotaryGnDivisionDTO[] = [];
  result: NewNotaryViewDto;
  notaryTitle: string = '';
  subjectPassedLan: string = '';
  public date: Date;
  public requestID: string;
  public type: string;
  public data: any;
  public hasRemarks: boolean = true;
  public requestList = [];

  constructor(private formBuilder: FormBuilder,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.notaryDetails = this.newNotaryDataVarificationService.ViewNotaryDetails();

    this.notaryForm = this.formBuilder.group({
      title: new FormControl([Validators.required]),
      englishNameWithInitials: new FormControl([Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      sinhalaNameWithInitials: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      tamilNameWithInitials: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInEnglish: new FormControl([Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInSinhala: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      fullNameInTamil: new FormControl([Validators.pattern(PatternValidation.nameValidation)]),
      nic: new FormControl([Validators.required, Validators.pattern(PatternValidation.nicValidation)]),
      email: new FormControl([Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
      languages: new FormControl(''),
      enrolledDate: new FormControl([Validators.required]),
      passedDate: new FormControl([Validators.required]),
      dateOfBirth: new FormControl([Validators.required]),
      courtZone: new FormControl([Validators.required]),
      permenentAddressInEnglish: new FormControl([Validators.required]),
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
    this.getApplicationDetails();
  }

  getApplicationDetails() {
    // this.route.paramMap.subscribe(params => {
    //   this.searchType.requestID = params.get('id')
    // });

    this.searchType = new NewNotaryRequestsCategorySearchDto("1","1");
    this.newNotaryDataVarificationService.getNotaryDetails(this.searchType).subscribe(
      (result: NewNotaryViewDto) => {
        this.result = result;
        this.notaryForm.patchValue(
          {
            title: this.result.nametitle.english,
            englishNameWithInitials: this.result.nameWithInitial.english,
            sinhalaNameWithInitials: this.result.nameWithInitial.sinhala,
            tamilNameWithInitials: this.result.nameWithInitial.tamil,
            fullNameInEnglish: this.result.fullName.english,
            fullNameInSinhala: this.result.fullName.sinhala,
            fullNameInTamil: this.result.fullName.tamil,
            nic: this.result.nic,
            email: this.result.email,
            languages: this.result.language,
            enrolledDate: this.result.enrolledDate,
            passedDate: this.result.subjectPassedDate,
            dateOfBirth: this.result.dateOfBirth,
            courtZone: this.result.judicialZone,
            permenentAddressInEnglish: this.result.permanentAddress.english,
            permenentAddressInSinhala: this.result.permanentAddress.sinhala,
            permenentAddressInTamil: this.result.permanentAddress.tamil,
            currentAddressInEnglish: this.result.currantAddress.english,
            currentAddressInSinhala: this.result.currantAddress.sinhala,
            currentAddressInTamil: this.result.currantAddress.tamil,
            mobileNo: this.result.mobile,
            contactNo: this.result.contactNo,
            landRegistry: this.result.landRegistry,
          }
        );
        this.notaryTitle = this.result.nametitle.english;
        this.subjectPassedLan = this.result.subjectMedium;
        this.dsGnDivisions = this.result.newNotaryDsDivisionDTO;

        this.setWorkflowStage();
      },
      error1 => {
        console.log(error1)
      }
    );
  }

  setWorkflowStage(){
    let stageCode: string = this.result.workflowStageCode;
    this.newNotaryDataVarificationService.setWorkflowStage(stageCode);
  }

}
