import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PublicUserType } from 'src/app/shared/enum/public-user-type.enum';
import {CitizenService} from "../../../shared/service/citizen.service";
import {LandRegistriesDTO} from "../../../shared/dto/land-registries-dto";
import {CitizenDTO} from "../../../shared/dto/citizen-dto";
import {BankService} from "../../../shared/service/bank.service";
import {BankDTO} from "../../../shared/dto/bank-dto";
import {PublicUserDTO} from "../../../shared/dto/public-user-dto";

@Component({
  selector: "app-add-public-user",
  templateUrl: "./add-public-user.component.html",
  styleUrls: ["./add-public-user.component.css"]
})
export class AddPublicUserComponent implements OnInit {
  public publicUserForm: FormGroup;
  public PublicUserType = PublicUserType;
  fileList = {};
  landRegistriesDTOList: Array<LandRegistriesDTO> = [];
  landRegistry: LandRegistriesDTO = new LandRegistriesDTO();
  citizenDTO: CitizenDTO = new CitizenDTO();

  bankUserTypeId: number;
  bankUserTypes = [
    {"id": 1, "type": "Manager"},
    {"id": 2, "type": "Notary"},
    {"id": 3, "type": "Other"}
  ];
  identificationTypes = [
    {"id": 1, "type": "NIC"},
    {"id": 2, "type": "Passport"},
    {"id": 3, "type": "Driving License"}
  ];

  banks: Array<BankDTO> = [];
  publicUserDTO: PublicUserDTO = new PublicUserDTO();
  publicUserExist: boolean = false;
  isContinue: boolean = false;
  formData: FormData = new FormData();

  get publicUserType() {
    return this.publicUserForm.get('type');
  }

  constructor(private citizenService: CitizenService, private bankService: BankService) {}

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      lawFirmName: new FormControl("", [Validators.required]),
      nameEnglish: new FormControl("", [Validators.required]),
      nameSinhala: new FormControl("", [Validators.required]),
      nameTamil: new FormControl("", [Validators.required]),
      bankName: new FormControl("", [Validators.required]),
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
  }
  getCurrentBank(event) {
    this.citizenDTO.bankId = event.target.value;
  }
  getCurrentIdentificationType(event) {
    this.citizenDTO.identificationNoType = event.target.value;
  }
  getCurrentUserType(event) {
    this.citizenDTO.userType = event.target.value;
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
    // this.isContinue = true;


    this.citizenService.saveCitizenAndFormData(this.fileList, this.citizenDTO)
      .subscribe((result) => {
        if (result) {
          this.isContinue = true;
        }else{
          alert('Failed');
        }
      });
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
}
