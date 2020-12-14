import { SystemService } from './../../../../shared/service/system.service';
import { state } from '@angular/animations';
import { Router } from '@angular/router';
import { PatternValidation } from './../../../../shared/enum/pattern-validation.enum';
import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Workflow} from "../../../../shared/enum/workflow.enum";
import {WorkflowStageCitizenReg} from "../../../../shared/enum/workflow-stage-citizen-reg.enum";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LandRegistriesDTO} from "../../../../shared/dto/land-registries-dto";
import {CitizenDTO} from "../../../../shared/dto/citizen-dto";
import {BankDTO} from "../../../../shared/dto/bank-dto";
import {PublicUserDTO} from "../../../../shared/dto/public-user-dto";
import {CitizenService} from "../../../../shared/service/citizen.service";
import {BankService} from "../../../../shared/service/bank.service";
import { PublicUserType } from '../../../../shared/enum/public-user-type.enum';
import {Parameters} from '../../../../shared/enum/parameters.enum';
import {SearchRequestType} from '../../../../shared/enum/search-request-type.enum';
import {SessionService} from "../../../../shared/service/session.service";
import {CommonStatus} from "../../../../shared/enum/common-status.enum";
import {SnackBarService} from "../../../../shared/service/snack-bar.service";
import {BankUserType} from "../../../../shared/enum/bank-user-type.enum";
import {IdentificationType} from "../../../../shared/enum/identification-type.enum";
import {SysMethodsService} from '../../../../shared/service/sys-methods.service';
import {StatusDTO} from '../../../../shared/dto/status-dto';
import {BankBranchService} from '../../../../shared/service/bank-branch.service';

@Component({
  selector: 'app-citizen-application',
  templateUrl: './citizen-application.component.html',
  styleUrls: ['./citizen-application.component.css']
})
export class CitizenApplicationComponent implements OnInit {
  @Input() isEdit = false;
  user;
  formControlStatus: boolean = false;
  commonStatus = CommonStatus;
  public SearchRequestType = SearchRequestType;
  public Parameters = Parameters;
  public WorkflowCode = Workflow;
  public WorkflowStageForCitizenReg = WorkflowStageCitizenReg;

  public publicUserForm: FormGroup;
  public PublicUserType = PublicUserType;
  public bankUsersType = BankUserType;
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
  showSpinner = false;
  isEnableUpdate = false;
  publicApplication: FormGroup;
  bankBranches: any[] = [];

  get publicUserType() {
    return this.publicUserForm.get('type');
  }

  constructor(private citizenService: CitizenService,
              private bankService: BankService,
              private bankBranchService: BankBranchService,
              private sessionService: SessionService,
              private snackBar: SnackBarService,
              private sysMethodsService: SysMethodsService,
              private router: Router,
              private systemService: SystemService) {}

  ngOnInit() {
    this.user = this.sessionService.getUser();
    this.getAllLandRegistries();
    this.getAllBanks();
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl({value: '', disabled: true}, [Validators.required]),
      lawFirmName: new FormControl('', []),
      nameEnglish: new FormControl('', [Validators.required,this.sysMethodsService.noWhitespaceValidator,
          Validators.pattern(PatternValidation.nameValidation),
          Validators.maxLength(255)]),
      nameSinhala: new FormControl('', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)
      ]),
      nameTamil: new FormControl('', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)
      ]),
      bankName: new FormControl('', []),
      bankBranch: new FormControl('', []),
      address1: new FormControl('', [
        Validators.pattern(PatternValidation.ADDRESS_PATTERN),
        Validators.maxLength(255)
      ]),
      address2: new FormControl('', [
        Validators.pattern(PatternValidation.ADDRESS_PATTERN),
        Validators.maxLength(255)
      ]),
      address3: new FormControl('', [
        Validators.pattern(PatternValidation.ADDRESS_PATTERN),
        Validators.maxLength(255)
      ]),
      identificationNo: new FormControl('', [
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(15),
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)
      ]),
      identificationType: new FormControl("", [Validators.required]),
      primaryContact: new FormControl('', [
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.contactNumberValidation)
      ]),
      secondaryContact: new FormControl('', [
        Validators.pattern(PatternValidation.contactNumberValidation)
      ]),
      reason: new FormControl('', [
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
      ]),
      officersDesignation: new FormControl('', []),
      stateInstitutionName: new FormControl('', []),
      otherInstitutionName: new FormControl('', []),
    });
    if (!this.isEdit) {
      this.publicUserForm.disable();
    }
    this.onBankChange();
    this.getApplicationDetails(this.user.id);
  }

  get nameEnglish() {
    return this.publicUserForm.get('nameEnglish');
  }

  get nameSinhala() {
    return this.publicUserForm.get('nameSinhala');
  }

  get nameTamil() {
    return this.publicUserForm.get('nameTamil');
  }

  get officersDesignation() {
    return this.publicUserForm.get('officersDesignation');
  }

  get stateInstitutionName() {
    return this.publicUserForm.get('stateInstitutionName');
  }

  get otherInstitutionName() {
    return this.publicUserForm.get('otherInstitutionName');
  }

  get bankUserType() {
    return this.publicUserForm.get('bankUserType');
  }

  get notaryId() {
    return this.publicUserForm.get('notaryId');
  }

  get lawFirmName() {
    return this.publicUserForm.get('lawFirmName');
  }

  get bankName() {
    return this.publicUserForm.get('bankName');
  }

  get bankBranch() {
    return this.publicUserForm.get('bankBranch');
  }

  get address1() {
    return this.publicUserForm.get('address1');
  }

  get address2() {
    return this.publicUserForm.get('address2');
  }

  get address3() {
    return this.publicUserForm.get('address3');
  }

  get identificationNo() {
    return this.publicUserForm.get('identificationNo');
  }

  get primaryContact() {
    return this.publicUserForm.get('primaryContact');
  }

  get secondaryContact() {
    return this.publicUserForm.get('secondaryContact');
  }

  get reason() {
    return this.publicUserForm.get('reason');
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
    this.citizenDTO.landRegistry = event.value;
  }
  getCurrentBankUserType(event) {
    this.bankUserTypeId = event.target.value;
    this.citizenDTO.bankUserType = this.bankUserTypeId;
  }

  getCurrentBank(event) {
    this.citizenDTO.bankId = event.value;
  }

  onBankChange(){
    this.bankName.valueChanges.subscribe(
      value => {
        if(value) this.getBankBranches(value);
      }
    );
  }

  getBankBranches(bankId: number) {
    this.bankBranchService.findAllByBankId(bankId).subscribe(
      (response: any) => {
        this.bankBranches = response;
      },
      () => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
      }
    );
  }

  selectBranch(bankBranchId: number) {
    this.citizenDTO.bankBranchId = bankBranchId;
  }

  getCurrentIdentificationType(event) {
    this.citizenDTO.identificationNoType = event.value;
    this.identificationNo.setValue("");
    this.identificationNo.markAsTouched({onlySelf:true});

    if (event.value == IdentificationType.NIC) {
      this.identificationNo.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.NIC_PATTERN)
      ]);
    } else if (event.value == IdentificationType.PASSPORT) {
      this.identificationNo.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.PASSPORT_VALIDATION)
      ]);
    } else if (event.value == IdentificationType.DRIVING_LICENSE) {
      this.identificationNo.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.DRIVING_LICENSE_VALIDATION)
      ]);
    }

  }

  getCurrentUserType(event) {
    this.citizenDTO.userType = event.value;
    this.updateValidators(event.value);
  }

  saveCitizen() {

    this.showSpinner = true;

    this.citizenDTO.nameEng = this.publicUserForm.controls.nameEnglish.value;
    this.citizenDTO.nameSin = this.publicUserForm.controls.nameSinhala.value;
    this.citizenDTO.nameTam = this.publicUserForm.controls.nameTamil.value;
    this.citizenDTO.addressEng = this.publicUserForm.controls.address1.value;
    this.citizenDTO.addressSin = this.publicUserForm.controls.address2.value;
    this.citizenDTO.addressTam = this.publicUserForm.controls.address3.value;
    this.citizenDTO.residentialTelephone = this.publicUserForm.controls.primaryContact.value;
    this.citizenDTO.mobileNo = this.publicUserForm.controls.secondaryContact.value;
    this.citizenDTO.reason = this.publicUserForm.controls.reason.value;
    this.citizenDTO.identificationNo = this.publicUserForm.controls.identificationNo.value;
    this.citizenDTO.lawFirmName = this.publicUserForm.controls.lawFirmName.value;
    this.citizenDTO.stateInstituteName = this.publicUserForm.controls.stateInstitutionName.value;
    this.citizenDTO.officerDesignation = this.publicUserForm.controls.officersDesignation.value;
    this.citizenDTO.otherInstituteName = this.publicUserForm.controls.otherInstitutionName.value;

    this.citizenService.updateCitizen(this.citizenDTO)
      .subscribe((result) => {
        if (result) {
          this.snackBar.success('Successfully updated');
        }
      },
        () => {
          this.snackBar.error(this.systemService.getTranslation('ALERT.WARNING.INTERNAL_SERVER_ERROR'));
        },
        () => {
          this.showSpinner = false;
          // check application value change validity
          this.checkApplicationUpdateStatus();
          this.isEnableUpdate = false;
          this.citizenService.setChangesEnable(true);
        });
  }

  getApplicationDetails(citizenId: number) {
    this.citizenService.getApplicationDetails(citizenId)
      .subscribe((result) => {
        if (result) {
          this.citizenDTO = result;
          this.citizenService.citizenDto.emit(this.citizenDTO);
          this.publicUserForm.patchValue({
            nameEnglish: this.citizenDTO.nameEng,
            nameSinhala: this.citizenDTO.nameSin,
            nameTamil: this.citizenDTO.nameTam,
            address1: this.citizenDTO.addressEng,
            address2: this.citizenDTO.addressSin,
            address3: this.citizenDTO.addressTam,
            primaryContact: this.citizenDTO.residentialTelephone,
            secondaryContact: this.citizenDTO.mobileNo,
            reason: this.citizenDTO.reason,
            identificationNo: this.citizenDTO.identificationNo,
            lawFirmName: this.citizenDTO.lawFirmName,
            stateInstitutionName: this.citizenDTO.stateInstituteName,
            officersDesignation: this.citizenDTO.officerDesignation,
            otherInstitutionName: this.citizenDTO.otherInstituteName,
            nearestLr: this.citizenDTO.landRegistry,
            type: this.citizenDTO.userType,
            bankName: this.citizenDTO.bankId,
            bankBranch: +this.citizenDTO.bankBranchId,
            identificationType: this.citizenDTO.identificationNoType,
          });
        }

        this.updateValidators(result.userType);
      },
        () => { },
        () => {
          this.checkApplicationUpdateStatus();
        });
  }

  checkApplicationUpdateStatus(): void {
    this.publicApplication = this.publicUserForm.value;
    this.publicUserForm.valueChanges.subscribe(
      (result) => {
        this.isEnableUpdate = JSON.stringify(this.publicApplication) !== JSON.stringify(result);
      }
    );
  }

  updateValidators(userType: number) {
    if (userType !== PublicUserType.OTHER) {
      this.address1.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)
      ]);
    }
    if (userType === PublicUserType.CITIZEN) {
      this.bankName.clearValidators();
      this.bankBranch.clearValidators();
      this.lawFirmName.clearValidators();
      this.stateInstitutionName.clearValidators();
      this.otherInstitutionName.clearValidators();
      this.officersDesignation.clearValidators();
    }
    if (userType === PublicUserType.BANK) {
      this.bankName.setValidators([
        Validators.required
      ]);
      this.bankBranch.setValidators([
        Validators.required
      ]);
      this.lawFirmName.clearValidators();
      this.stateInstitutionName.clearValidators();
      this.otherInstitutionName.clearValidators();
      this.officersDesignation.clearValidators();
    }
    if (userType === PublicUserType.LAWYER) {
      this.lawFirmName.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]);
      this.bankName.clearValidators();
      this.bankBranch.clearValidators();
      this.stateInstitutionName.clearValidators();
      this.otherInstitutionName.clearValidators();
      this.officersDesignation.clearValidators();
    }
    if (userType === PublicUserType.STATE) {
      this.stateInstitutionName.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]);
      this.bankName.clearValidators();
      this.bankBranch.clearValidators();
      this.lawFirmName.clearValidators();
      this.otherInstitutionName.clearValidators();
      this.officersDesignation.clearValidators();
    }
    if (userType === PublicUserType.OTHER) {
      this.otherInstitutionName.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]);
      this.officersDesignation.setValidators([
        Validators.required,this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]);
      this.bankName.clearValidators();
      this.bankBranch.clearValidators();
      this.lawFirmName.clearValidators();
      this.stateInstitutionName.clearValidators();
      this.address1.clearAsyncValidators();
    }
  }

}
