import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Workflow} from "../../../../shared/enum/workflow.enum";
import {WorkflowStageCitizenReg} from "../../../../shared/enum/workflow-stage-citizen-reg.enum";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LandRegistriesDTO} from "../../../../shared/dto/land-registries-dto";
import {CitizenDTO} from "../../../../shared/dto/citizen-dto";
import {BankDTO} from "../../../../shared/dto/bank-dto";
import {PublicUserDTO} from "../../../../shared/dto/public-user-dto";
import {CitizenService} from "../../../../shared/service/citizen.service";
import {BankService} from "../../../../shared/service/bank.service";
import {PaymentResponse} from "../../../../shared/dto/payment-response.model";
import { PublicUserType } from '../../../../shared/enum/public-user-type.enum';
import {Parameters} from '../../../../shared/enum/parameters.enum';
import {SearchRequestType} from '../../../../shared/enum/search-request-type.enum';
import {SessionService} from "../../../../shared/service/session.service";
import {CommonStatus} from "../../../../shared/enum/common-status.enum";
import {SnackBarService} from "../../../../shared/service/snack-bar.service";
import {BankUserType} from "../../../../shared/enum/bank-user-type.enum";
import {IdentificationType} from "../../../../shared/enum/identification-type.enum";

@Component({
  selector: 'app-citizen-application',
  templateUrl: './citizen-application.component.html',
  styleUrls: ['./citizen-application.component.css']
})
export class CitizenApplicationComponent implements OnInit {
  user;
  formControlStatus: boolean = false;
  commonStatus = CommonStatus;
  public SearchRequestType = SearchRequestType;
  public Parameters = Parameters;
  public WorkflowCode = Workflow;
  public WorkflowStageForCitizenReg = WorkflowStageCitizenReg;

  public publicUserForm: FormGroup;
  public PublicUserType = PublicUserType;
  public bankUserType = BankUserType;
  public identificationType = IdentificationType;
  fileList = {};
  landRegistriesDTOList: Array<LandRegistriesDTO> = [];
  landRegistry: LandRegistriesDTO = new LandRegistriesDTO();
  citizenDTO: CitizenDTO = new CitizenDTO();

  bankUserTypeId: number;

  banks: Array<BankDTO> = [];
  publicUserDTO: PublicUserDTO = new PublicUserDTO();
  publicUserExist: boolean = false;
  isContinue: boolean = false;
  formData: FormData = new FormData();

  get publicUserType() {
    return this.publicUserForm.get('type');
  }

  constructor(private citizenService: CitizenService,
              private bankService: BankService,
              private sessionService: SessionService,
              private snackBar: SnackBarService) {}

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      lawFirmName: new FormControl("", [Validators.required]),
      nameEnglish: new FormControl("", [Validators.required]),
      nameSinhala: new FormControl("", [Validators.required]),
      nameTamil: new FormControl("", [Validators.required]),
      bankName: new FormControl("", [Validators.required]),
      bankUserType: new FormControl("", [Validators.required]),
      notaryId: new FormControl("", [Validators.required]),
      address1: new FormControl("", [Validators.required]),
      address2: new FormControl("", [Validators.required]),
      address3: new FormControl("", [Validators.required]),
      identificationNo: new FormControl("", [Validators.required]),
      identificationType: new FormControl("", [Validators.required]),
      primaryContact: new FormControl("", [Validators.required]),
      secondaryContact: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      userName: new FormControl("", [Validators.required]),
      reason: new FormControl("", [Validators.required]),
      renewalCertificate: new FormControl("", [Validators.required]),
      nicCopy: new FormControl("", [Validators.required]),
      signatureAndSeal: new FormControl("", [Validators.required]),
      recaptcha: new FormControl(null, Validators.required),
      officersDesignation: new FormControl("", [Validators.required]),
      stateInstitutionName: new FormControl("", [Validators.required]),
      otherInstitutionName: new FormControl("", [Validators.required]),
      dateOfBirth: new FormControl("", [Validators.required]),
    });
    this.user = this.sessionService.getUser();
    this.getAllLandRegistries();
    this.getAllBanks();
    this.getApplicationDetails(this.user.id);

  }

  disableFormControls() {
    this.publicUserForm.controls['nearestLr'].disable();
    this.publicUserForm.controls['type'].disable();
    this.publicUserForm.controls['lawFirmName'].disable();
    this.publicUserForm.controls['nameEnglish'].disable();
    this.publicUserForm.controls['nameSinhala'].disable();
    this.publicUserForm.controls['nameTamil'].disable();
    this.publicUserForm.controls['bankName'].disable();
    this.publicUserForm.controls['notaryId'].disable();
    this.publicUserForm.controls['address1'].disable();
    this.publicUserForm.controls['address2'].disable();
    this.publicUserForm.controls['address3'].disable();
    this.publicUserForm.controls['identificationNo'].disable();
    this.publicUserForm.controls['identificationType'].disable();
    this.publicUserForm.controls['primaryContact'].disable();
    this.publicUserForm.controls['secondaryContact'].disable();
    this.publicUserForm.controls['email'].disable();
    this.publicUserForm.controls['reason'].disable();
    this.publicUserForm.controls['officersDesignation'].disable();
    this.publicUserForm.controls['stateInstitutionName'].disable();
    this.publicUserForm.controls['otherInstitutionName'].disable();
    this.publicUserForm.controls['dateOfBirth'].disable();
    this.publicUserForm.controls['notaryId'].disable();
  }

  setFiles(files, key){
    this.fileList[key] = files;
  }
  getAllLandRegistries() {
    this.citizenService.getAllLandRegistries()
      .subscribe((res) => {
        this.landRegistriesDTOList = res;
      });
  }

  getAllBanks() {
    this.bankService.getAllBanks()
      .subscribe((result) => {
        this.banks = result;
      });
  }

  getCurrentLandRegistry(event) {
    this.citizenDTO.landRegistry = event.target.value;
  }
  getCurrentBankUserType(event) {
    this.bankUserTypeId = event.target.value;
    this.citizenDTO.bankUserType = this.bankUserTypeId;
  }
  getCurrentBank(event) {
    this.citizenDTO.bankId = event.target.value;
  }
  getCurrentIdentificationType(event) {
    this.citizenDTO.identificationNoType = event.target.value;
  }
  getCurrentUserType(event) {
    this.citizenDTO.userType = event.target.value;

    if(this.citizenDTO.userType = PublicUserType.CITIZEN) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
    }
    else if(this.citizenDTO.userType = PublicUserType.BANK) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.BANK_INIT;
    }
    else if(this.citizenDTO.userType = PublicUserType.LAWYER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT;
    }
    else if(this.citizenDTO.userType = PublicUserType.STATE) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.STATE_INSTITUTE_INIT;
    }
    else if(this.citizenDTO.userType = PublicUserType.OTHER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT;
    }
  }

  saveCitizen() {

    this.citizenDTO.nameEng = this.publicUserForm.controls.nameEnglish.value;
    this.citizenDTO.nameSin = this.publicUserForm.controls.nameSinhala.value;
    this.citizenDTO.nameTam = this.publicUserForm.controls.nameTamil.value;
    this.citizenDTO.addressEng = this.publicUserForm.controls.address1.value;
    this.citizenDTO.addressSin = this.publicUserForm.controls.address2.value;
    this.citizenDTO.addressTam = this.publicUserForm.controls.address3.value;
    this.citizenDTO.email = this.publicUserForm.controls.email.value;
    this.citizenDTO.residentialTelephone = this.publicUserForm.controls.primaryContact.value;
    this.citizenDTO.mobileNo = this.publicUserForm.controls.secondaryContact.value;
    this.citizenDTO.reason = this.publicUserForm.controls.reason.value;
    this.citizenDTO.identificationNo = this.publicUserForm.controls.identificationNo.value;
    this.citizenDTO.dateOfBirth = this.publicUserForm.controls.dateOfBirth.value;
    this.citizenDTO.username = this.publicUserForm.controls.userName.value;
    this.citizenDTO.lawFirmName = this.publicUserForm.controls.lawFirmName.value;
    this.citizenDTO.stateInstituteName = this.publicUserForm.controls.stateInstitutionName.value;
    this.citizenDTO.officerDesignation = this.publicUserForm.controls.officersDesignation.value;
    this.citizenDTO.otherInstituteName = this.publicUserForm.controls.otherInstitutionName.value;
    this.citizenDTO.notaryId = this.publicUserForm.controls.notaryId.value;

    this.citizenService.updateCitizen(this.citizenDTO)
      .subscribe((result) => {
        if (result) {
          this.snackBar.success('Citizen updated successfully');
        }else{
          alert('Failed');
        }
      });
  }

  // onSearchChange(searchValue: string): void {
  //   // console.log(searchValue);
  //   this.publicUserDTO.username = searchValue;
  //   this.citizenService.checkForValidUsername(this.publicUserDTO).subscribe((result) => {
  //     if (result == true) {
  //       this.publicUserExist = true;
  //     }else {
  //       this.publicUserExist = false;
  //     }
  //   });
  // }

  getApplicationDetails(citizenId: number) {
    this.citizenService.getApplicationDetails(citizenId)
      .subscribe((result) => {
        if(result) {
          this.citizenDTO = result;
          console.log(this.citizenDTO);
          if(this.citizenDTO.workFlowStageCode == this.WorkflowStageForCitizenReg.BANK_INIT || this.citizenDTO.workFlowStageCode == this.WorkflowStageForCitizenReg.CITIZEN_INIT || this.citizenDTO.workFlowStageCode == this.WorkflowStageForCitizenReg.LAWYER_OR_LAW_FIRM_INIT || this.citizenDTO.workFlowStageCode == this.WorkflowStageForCitizenReg.STATE_INSTITUTE_INIT || this.citizenDTO.workFlowStageCode == this.WorkflowStageForCitizenReg.OTHER_INSTITUTE_INIT) {
            this.publicUserForm.disable();
          }
          if(this.citizenDTO.userType == this.PublicUserType.BANK) {
            this.bankUserTypeId = this.citizenDTO.bankUserType;
          }
          this.citizenService.paymentDetails.emit(this.citizenDTO.paymentHistory);
          this.citizenService.citizenDto.emit(this.citizenDTO);
          this.publicUserForm.patchValue({
            nameEnglish: this.citizenDTO.nameEng,
            nameSinhala: this.citizenDTO.nameSin,
            nameTamil: this.citizenDTO.nameTam,
            address1: this.citizenDTO.addressEng,
            address2: this.citizenDTO.addressSin,
            address3: this.citizenDTO.addressTam,
            email: this.citizenDTO.email,
            primaryContact: this.citizenDTO.residentialTelephone,
            secondaryContact: this.citizenDTO.mobileNo,
            reason: this.citizenDTO.reason,
            identificationNo: this.citizenDTO.identificationNo,
            dateOfBirth: this.citizenDTO.dateOfBirth,
            userName: this.citizenDTO.username,
            lawFirmName: this.citizenDTO.lawFirmName,
            stateInstitutionName: this.citizenDTO.stateInstituteName,
            officersDesignation: this.citizenDTO.officerDesignation,
            otherInstitutionName: this.citizenDTO.otherInstituteName,
            nearestLr: this.citizenDTO.landRegistry,
            type: this.citizenDTO.userType,
            bankName: this.citizenDTO.bankId,
            identificationType: this.citizenDTO.identificationNoType,
            bankUserType: this.citizenDTO.bankUserType,
            notaryId: this.citizenDTO.notaryId
          });
        }
      });
  }

}
