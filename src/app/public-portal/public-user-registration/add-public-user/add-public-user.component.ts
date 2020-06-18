import { SystemService } from './../../../shared/service/system.service';
import { UserType } from './../../../shared/enum/user-type.enum';
import { DocumentResponseDto } from './../../../shared/dto/document-response.dto';
import { CommonStatus } from 'src/app/shared/enum/common-status.enum';
import { PaymentMethod } from './../../../shared/enum/payment-method.enum';
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
  public workflowPayment: string;
  public WorkflowCode = Workflow;
  public WorkflowStageForCitizenReg = WorkflowStageCitizenReg;

  public publicUserForm: FormGroup;
  public PublicUserType = PublicUserType;
  public identificationType = IdentificationType;
  fileList = {};
  landRegistriesDTOList: Array<LandRegistriesDTO> = [];
  landRegistry: LandRegistriesDTO = new LandRegistriesDTO();
  citizenDTO: CitizenDTO = new CitizenDTO();
  paymentDto: PaymentDto = new PaymentDto();
  workflowStageDocTypes: Array<WorkflowStageDocTypeDTO> = [];
  maxDate = new Date();
  bankUserTypeId: number;

  banks: Array<BankDTO> = [];
  publicUserDTO: PublicUserDTO = new PublicUserDTO();
  publicUserExist: boolean = false;
  isContinue: boolean = false;
  isLrLoaded = false;
  formData: FormData = new FormData();
  isMadatoryDocsUploaded = false;
  docMetaList: DocumentResponseDto[] = [];
  

  /**
   * **Online payment method**
   * (paymentMethodResponse) will be emit Transaction reference (uuid), Application amount, Payment type
   *   after selection of payment type
   * If paymentMethod is an online payment save the form
   *  which is used as paymentReference
   * returnUrl should be the url where the user will be navigate after complete process.
   *    eg: /login (only the path)
   * set statusOnlinePayment to true after form save complete
   */
  paymentMethod: number;
  returnURl: string;
  statusOnlinePayment: boolean;
  userType = UserType.CITIZEN;
  userId: number;

  get publicUserType() {
    return this.publicUserForm.get('type');
  }

  constructor(private citizenService: CitizenService,
              private bankService: BankService,
              private snackBar: SnackBarService,
              private router: Router,
              private systemService: SystemService) {}

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      bankName: new FormControl("", [Validators.required]),
      lawFirmName: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)
      ]),
      nameEnglish: new FormControl("",
        [Validators.required,
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      nameSinhala: new FormControl('', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      nameTamil: new FormControl('', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)
      ]),
      address1: new FormControl("",
        [Validators.required,
          Validators.maxLength(255),
          Validators.pattern(PatternValidation.ADDRESS_PATTERN)
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
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)
      ]),
      identificationType: new FormControl("", [Validators.required]),
      primaryContact: new FormControl("",
        [Validators.required,
          Validators.pattern(PatternValidation.contactNumberValidation),
        ]),
      secondaryContact: new FormControl("", [Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl("",
        [Validators.required,
          Validators.pattern(PatternValidation.emailValidation)]),
      userName: new FormControl("", [Validators.required]),
      reason: new FormControl("", [
        Validators.required,
        Validators.maxLength(255)
      ]),
      recaptcha: new FormControl(null, Validators.required),
      officersDesignation: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]),
      stateInstitutionName: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]),
      otherInstitutionName: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]),
    });
    this.getAllLandRegistries();
    this.getAllBanks();
    this.citizenDTO.userType = this.PublicUserType.CITIZEN;
    this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
    this.disableUselessFormControls(this.citizenDTO.userType);
  }

  get FormControls() {
    return this.publicUserForm.controls;
  }

  get nearestLr() {
    return this.publicUserForm.get('nearestLr');
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

  get address1() {
    return this.publicUserForm.get('address1');
  }

  get identificationNo() {
    return this.publicUserForm.get('identificationNo');
  }

  get reason() {
    return this.publicUserForm.get('reason');
  }

  get email() {
    return this.publicUserForm.get('email');
  }

  get recaptcha() {
    return this.publicUserForm.get('recaptcha');
  }

  get officersDesignation() {
    return this.publicUserForm.get('officersDesignation');
  }

  get stateInstitutionName() {
    return this.publicUserForm.get('stateInstitutionName');
  }

  get notaryId() {
    return this.publicUserForm.get('notaryId');
  }

  get lawFirmName() {
    return this.publicUserForm.get('lawFirmName');
  }

  get address2() {
    return this.publicUserForm.get('address2');
  }

  get address3() {
    return this.publicUserForm.get('address3');
  }

  get type() {
    return this.publicUserForm.get('type');
  }

  setFiles(files, key, status: boolean){
    this.fileList[key] = files;
    console.log('file list: ', this.fileList);

    // validate mandatory doc upload
    if (files.length > 0 ) {
      const docMetaData = new DocumentResponseDto(null, key, files[0], status ? CommonStatus.REQUIRED : CommonStatus.OPTIONAL);
      this.docMetaList.push(docMetaData);
    } else {
      this.docMetaList.forEach((doc, index) => {
        if (doc.docTypeId === key) {
          this.docMetaList.splice(index, 1);
        }
      });
    }

    let workflowMandatoryDocs = 0;
    let uploadMadatoryDocs = 0;
    this.workflowStageDocTypes.forEach((doc) => {
      if (doc.required) {
        workflowMandatoryDocs += 1;
      }
    });

    this.docMetaList.forEach((doc) => {
      if (doc.status === CommonStatus.REQUIRED) {
        uploadMadatoryDocs += 1;
      }
    });

    if (workflowMandatoryDocs === uploadMadatoryDocs) {
      this.isMadatoryDocsUploaded = true;
    } else {
      this.isMadatoryDocsUploaded = false;
    }


  }
  getAllLandRegistries() {
    this.citizenService.getAllLandRegistries()
      .subscribe((res) => {
        this.landRegistriesDTOList = res;
      },
      () => {},
      () => {
        this.isLrLoaded = true;
      });
  }

  getAllBanks() {
    this.bankService.getAllBanks()
      .subscribe((result) => {
        this.banks = result;
      });
  }

  getCurrentLandRegistry(lrCode: number) {
    this.citizenDTO.landRegistry = lrCode;
  }
  
  getCurrentBank(event) {
    this.citizenDTO.bankId = event.value;
  }
  getCurrentIdentificationType(event) {
    this.citizenDTO.identificationNoType = event.value;

    // set ref no validations
    // clear  identification with type change
    this.identificationNo.setValue('');
    if (event.value == IdentificationType.NIC) {
      this.identificationNo.setValidators([
        Validators.required,
        Validators.pattern(PatternValidation.NIC_PATTERN)
      ]);
    } else if (event.value == IdentificationType.PASSPORT) {
      this.identificationNo.setValidators([
        Validators.required,
        Validators.pattern(PatternValidation.PASSPORT_VALIDATION)
      ]);
    } else if (event.value == IdentificationType.DRIVING_LICENSE) {
      this.identificationNo.setValidators([
        Validators.required,
      ]);
    }
    this.publicUserForm.updateValueAndValidity();
  }
  getCurrentUserType(userType: number) {

    this.docMetaList = [];
    this.isMadatoryDocsUploaded = false;
    this.citizenDTO.userType = userType;
    this.publicUserForm.enable();
    this.disableUselessFormControls(this.citizenDTO.userType);

    if(this.citizenDTO.userType == PublicUserType.CITIZEN) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
      this.workflowPayment = Parameters.CITIZEN_REGISTRATION_FEE;
    }
    else if(this.citizenDTO.userType == PublicUserType.BANK) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.BANK_INIT;
      this.workflowPayment = Parameters.BANK_REGISTRATION_FEE;
    }
    else if(this.citizenDTO.userType == PublicUserType.LAWYER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT;
      this.workflowPayment = Parameters.LAWYER_LAW_FIRM_REGISTRATION_FEE;
    }
    else if(this.citizenDTO.userType == PublicUserType.STATE) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.STATE_INSTITUTE_INIT;
      this.workflowPayment = Parameters.STATE_INSTITUTE_REGISTRATION_FEE;
    }
    else if(this.citizenDTO.userType == PublicUserType.OTHER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT;
      this.workflowPayment = Parameters.OTHER_INSTITUTE_REGISTRATION_FEE;
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
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
      this.officersDesignation.disable();
    }
    else if (type == this.PublicUserType.BANK) {
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.LAWYER) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.STATE) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.OTHER) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['address1'].disable();
      this.publicUserForm.controls['address2'].disable();
      this.publicUserForm.controls['address3'].disable();
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
    this.citizenDTO.username = this.publicUserForm.controls.userName.value;
    this.citizenDTO.lawFirmName = this.publicUserForm.controls.lawFirmName.value;
    this.citizenDTO.stateInstituteName = this.publicUserForm.controls.stateInstitutionName.value;
    this.citizenDTO.officerDesignation = this.publicUserForm.controls.officersDesignation.value;
    this.citizenDTO.otherInstituteName = this.publicUserForm.controls.otherInstitutionName.value;

    this.citizenService.saveCitizenAndFormData(this.fileList, this.citizenDTO)
      .subscribe((result) => {
        if (result && this.paymentMethod !== PaymentMethod.ONLINE) {
          this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
          this.router.navigate(['/login']);
        } else if (this.paymentMethod === PaymentMethod.ONLINE) {
          this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS_PROCEED_ONLINE_PAYMENT'));
          this.isContinue = true;
          this.statusOnlinePayment = true;
          this.userId = result.id;
        } else {
          this.snackBar.error('Operation failed');
        }
      });
  }

  onSearchChange(searchValue: string): void {
    this.publicUserDTO.username = searchValue;
    this.citizenService.checkForValidUsername(this.publicUserDTO).subscribe((result) => {
        if (result == true) {
          this.publicUserExist = true;
          this.email.setErrors({incorrect: true});
        }else {
          this.publicUserExist = false;
        }
    });
  }

  setUserName(userName: string): void {
    this.publicUserForm.patchValue({
      userName: userName,
    });
    if (userName.trim().length > 0 && this.email.valid) {
      this.onSearchChange(userName);
    }
  }

  onBack(data: boolean) {
    this.isContinue = !data;
  }
  onPaymentResponse(data: PaymentResponse) {
    if (this.paymentMethod !== PaymentMethod.ONLINE) {
      this.paymentDto.paymentId = data.paymentId;
      this.citizenDTO.payment = this.paymentDto;
      this.saveCitizen();
    }
  }

  /**
   * returns payment response with the payment method & application amount
   */
  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    // save citizen form for online payment with reference no
    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.citizenDTO.payment = this.paymentDto;
      this.returnURl = ('login');
      this.saveCitizen();
    }

  }

  continue(): void {
    if (this.publicUserForm.valid) {
      this.isContinue = true;
    } else {
      this.publicUserForm.setErrors(Validators.required);
    }
  }

  getBase64(url: string): string {
    return btoa(url);
  }
}
