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
      lawFirmName: new FormControl("", [Validators.required]),
      nameEnglish: new FormControl("", [Validators.required]),
      nameSinhala: new FormControl("", [Validators.required]),
      nameTamil: new FormControl("", [Validators.required]),
      notaryId: new FormControl("", [Validators.required]),
      address1: new FormControl("", [Validators.required]),
      address2: new FormControl("", [Validators.required]),
      address3: new FormControl("", [Validators.required]),
      identificationNo: new FormControl("", [Validators.required]),
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
    console.log(this.PublicUserType);
    this.getAllLandRegistries();
    this.getAllBanks();
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

    if(this.paymentDto.paymentId == null) {
      this.isContinue = true;
    }else{
      this.citizenService.saveCitizenAndFormData(this.fileList, this.citizenDTO)
        .subscribe((result) => {
          if (result) {
            this.snackBar.success('Citizen saved successfully');
            this.router.navigate(['/login']);
            console.log(result);
          }else{
            this.snackBar.error('Operation failed');
          }
        });
    }
  }

  onSearchChange(searchValue: string): void {
    // console.log(searchValue);
    this.publicUserDTO.username = searchValue;
    this.citizenService.checkForValidUsername(this.publicUserDTO).subscribe((result) => {
        if (result == true) {
          this.publicUserExist = true;
        }else {
          this.publicUserExist = false;
        }
    });
  }

  onBack(data: boolean) {
    this.isContinue = !data;
  }
  onPaymentResponse(data: PaymentResponse) {
    this.isContinue = false;
    console.log(data);
    this.paymentDto.paymentId = data.paymentId;
    this.citizenDTO.payment = this.paymentDto;
  }

}
