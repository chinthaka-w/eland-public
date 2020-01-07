import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PublicUserType } from 'src/app/shared/enum/public-user-type.enum';
import {CitizenService} from "../../../shared/service/citizen.service";
import {LandRegistriesDTO} from "../../../shared/dto/land-registries-dto";
import {CitizenDTO} from "../../../shared/dto/citizen-dto";
import {BankService} from "../../../shared/service/bank.service";
import {BankDTO} from "../../../shared/dto/bank-dto";
import {PublicUserDTO} from "../../../shared/dto/public-user-dto";
import {Workflow} from "../../../shared/enum/workflow.enum";
import {Parameters} from '../../../shared/enum/parameters.enum';
import {SearchRequestType} from '../../../shared/enum/search-request-type.enum';
import {WorkflowStageCitizenReg} from "../../../shared/enum/workflow-stage-citizen-reg.enum";
import {PaymentResponse} from "../../../shared/dto/payment-response.model";
import {SnackBarService} from "../../../shared/service/snack-bar.service";
import {PaymentDto} from "../../../shared/dto/payment-dto";
import {Router} from "@angular/router";
import {BankUserType} from "../../../shared/enum/bank-user-type.enum";
import {IdentificationType} from "../../../shared/enum/identification-type.enum";
import {PatternValidation} from "../../../shared/enum/pattern-validation.enum";
import {WorkflowStageDocTypeDTO} from "../../../shared/dto/workflow-stage-doc-type-dto";

@Component({
  selector: "app-add-public-user",
  templateUrl: "./add-public-user.component.html",
  styleUrls: ["./add-public-user.component.css"]
})
export class AddPublicUserComponent implements OnInit {
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
  paymentDto: PaymentDto = new PaymentDto();
  workflowStageDocTypes: Array<WorkflowStageDocTypeDTO> = [];

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
              private snackBar: SnackBarService,
              private router: Router) {}

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      bankName: new FormControl("", [Validators.required]),
      bankUserType: new FormControl("", [Validators.required]),
      lawFirmName: new FormControl("", [Validators.required]),
      nameEnglish: new FormControl("", [Validators.required, Validators.pattern(PatternValidation.nameValidation)]),
      nameSinhala: new FormControl(""),
      nameTamil: new FormControl(""),
      notaryId: new FormControl("", [Validators.required]),
      address1: new FormControl("", [Validators.required]),
      address2: new FormControl(""),
      address3: new FormControl(""),
      identificationNo: new FormControl("", [Validators.required]),
      identificationType: new FormControl("", [Validators.required]),
      primaryContact: new FormControl("", [Validators.required, Validators.pattern(PatternValidation.contactNumberValidation)]),
      secondaryContact: new FormControl("", [Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl("", [Validators.required, Validators.pattern(PatternValidation.emailValidation)]),
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
    this.getAllLandRegistries();
    this.getAllBanks();
    this.citizenDTO.userType = this.PublicUserType.CITIZEN;
    this.publicUserForm.patchValue({type: this.citizenDTO.userType});
    this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
    this.getRelatedDocTypes(this.citizenDTO.workFlowStageCode);
    this.disableUselessFormControls(this.citizenDTO.userType);
  }

  get FormControls() {
    return this.publicUserForm.controls;
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
    this.publicUserForm.controls['notaryId'].enable();
    if(this.citizenDTO.userType == this.PublicUserType.BANK){
      if((this.bankUserTypeId == this.bankUserType.MANAGER) || (this.bankUserTypeId == this.bankUserType.OTHER)) {
        this.publicUserForm.controls['notaryId'].disable();
      }
    }
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
    this.publicUserForm.enable();
    this.disableUselessFormControls(this.citizenDTO.userType);

    if(this.citizenDTO.userType == PublicUserType.CITIZEN) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
    }
    else if(this.citizenDTO.userType == PublicUserType.BANK) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.BANK_INIT;
    }
    else if(this.citizenDTO.userType == PublicUserType.LAWYER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT;
    }
    else if(this.citizenDTO.userType == PublicUserType.STATE) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.STATE_INSTITUTE_INIT;
    }
    else if(this.citizenDTO.userType == PublicUserType.OTHER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT;
    }
    this.getRelatedDocTypes(this.citizenDTO.workFlowStageCode);
  }

  getRelatedDocTypes(workflowStage: string) {
    this.citizenService.getRelatedDocTypes(workflowStage)
      .subscribe((result) => {
        this.workflowStageDocTypes = result;
      });
  }

  disableUselessFormControls(type: number) {
    if(type == this.PublicUserType.CITIZEN) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankUserType'].disable();
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['notaryId'].disable();
      this.publicUserForm.controls['renewalCertificate'].disable();
      this.publicUserForm.controls['nicCopy'].disable();
      this.publicUserForm.controls['signatureAndSeal'].disable();
      this.publicUserForm.controls['recaptcha'].disable();
      this.publicUserForm.controls['officersDesignation'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.BANK) {
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['renewalCertificate'].disable();
      this.publicUserForm.controls['nicCopy'].disable();
      this.publicUserForm.controls['signatureAndSeal'].disable();
      this.publicUserForm.controls['recaptcha'].disable();
      this.publicUserForm.controls['officersDesignation'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.LAWYER) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankUserType'].disable();
      this.publicUserForm.controls['renewalCertificate'].disable();
      this.publicUserForm.controls['nicCopy'].disable();
      this.publicUserForm.controls['signatureAndSeal'].disable();
      this.publicUserForm.controls['recaptcha'].disable();
      this.publicUserForm.controls['officersDesignation'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.STATE) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankUserType'].disable();
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['renewalCertificate'].disable();
      this.publicUserForm.controls['nicCopy'].disable();
      this.publicUserForm.controls['signatureAndSeal'].disable();
      this.publicUserForm.controls['recaptcha'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.OTHER) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankUserType'].disable();
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['renewalCertificate'].disable();
      this.publicUserForm.controls['nicCopy'].disable();
      this.publicUserForm.controls['signatureAndSeal'].disable();
      this.publicUserForm.controls['recaptcha'].disable();
      this.publicUserForm.controls['officersDesignation'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
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

    if(!(this.paymentDto.paymentId)) {
      this.isContinue = true;
    }else{
      this.citizenService.saveCitizenAndFormData(this.fileList, this.citizenDTO)
        .subscribe((result) => {
          if (result) {
            this.snackBar.success('Citizen saved successfully');
            this.router.navigate(['/login']);
          }else{
            this.snackBar.error('Operation failed');
          }
        });
    }
  }

  onSearchChange(searchValue: string): void {
    this.publicUserDTO.username = searchValue;
    this.citizenService.checkForValidUsername(this.publicUserDTO).subscribe((result) => {
        if (result == true) {
          this.publicUserExist = true;
        }else {
          this.publicUserExist = false;
        }
    });
  }

  setUserName(userName: string): void {
    this.publicUserForm.patchValue({
      userName: userName,
    });
    this.onSearchChange(userName);
  }

  onBack(data: boolean) {
    this.isContinue = !data;
  }
  onPaymentResponse(data: PaymentResponse) {
    this.paymentDto.paymentId = data.paymentId;
    this.citizenDTO.payment = this.paymentDto;
    this.saveCitizen();
  }

}
