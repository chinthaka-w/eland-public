import {StatusDTO} from './../../../shared/dto/status-dto';
import {SystemService} from './../../../shared/service/system.service';
import {UserType} from './../../../shared/enum/user-type.enum';
import {DocumentResponseDto} from './../../../shared/dto/document-response.dto';
import {CommonStatus} from 'src/app/shared/enum/common-status.enum';
import {PaymentMethod} from './../../../shared/enum/payment-method.enum';
import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PublicUserType} from 'src/app/shared/enum/public-user-type.enum';
import {CitizenService} from '../../../shared/service/citizen.service';
import {LandRegistriesDTO} from '../../../shared/dto/land-registries-dto';
import {CitizenDTO} from '../../../shared/dto/citizen-dto';
import {BankService} from '../../../shared/service/bank.service';
import {BankDTO} from '../../../shared/dto/bank-dto';
import {PublicUserDTO} from '../../../shared/dto/public-user-dto';
import {Workflow} from '../../../shared/enum/workflow.enum';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {SearchRequestType} from '../../../shared/enum/search-request-type.enum';
import {WorkflowStageCitizenReg} from '../../../shared/enum/workflow-stage-citizen-reg.enum';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {PaymentDto} from '../../../shared/dto/payment-dto';
import {Router} from '@angular/router';
import {IdentificationType} from '../../../shared/enum/identification-type.enum';
import {PatternValidation} from '../../../shared/enum/pattern-validation.enum';
import {WorkflowStageDocTypeDTO} from '../../../shared/dto/workflow-stage-doc-type-dto';
import {AuthorizeRequestService} from '../../../shared/service/authorize-request.service';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';
import {RecaptchaLoaderService, ReCaptchaV3Service} from 'ng-recaptcha';
import {DocumentDto} from '../../../shared/dto/document-list';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc.dto';
import {RequestData} from '../../../shared/dto/request-data.model';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {TempData} from '../../../shared/dto/temp-data.model';

@Component({
  selector: 'app-add-public-user',
  templateUrl: './add-public-user.component.html',
  styleUrls: ['./add-public-user.component.css']
})
export class AddPublicUserComponent implements OnInit {

  @Input()
  files: File[] = [];

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
  bankBranches: StatusDTO[] = [];

  errorMsg: any;

  public docList: WorkflowStageDocDto[];
  public documentList: DocumentDto[] = [];

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

  get IdentificationType1() {
    return this.publicUserForm.get('identificationType');
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

  get bankBranch() {
    return this.publicUserForm.get('bankBranch');
  }

  get bankName() {
    return this.publicUserForm.get('bankName');
  }

  constructor(private citizenService: CitizenService,
              private bankService: BankService,
              private snackBar: SnackBarService,
              private sysMethodsService: SysMethodsService,
              private authorizeRequestService: AuthorizeRequestService,
              private router: Router,
              private tokenStorageService: TokenStorageService,
              private systemService: SystemService) {
  }

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      bankName: new FormControl('', [Validators.required]),
      bankBranch: new FormControl('', [Validators.required]),
      lawFirmName: new FormControl('', [
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.PERSON_NAME_PATTERN)
      ]),
      nameEnglish: new FormControl('',
        [Validators.required, this.sysMethodsService.noWhitespaceValidator,
          Validators.pattern(PatternValidation.nameValidation),
          Validators.maxLength(255)]),
      nameSinhala: new FormControl('', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)]),
      nameTamil: new FormControl('', [
        Validators.pattern(PatternValidation.nameValidation),
        Validators.maxLength(255)
      ]),
      address1: new FormControl('',
        [Validators.required, this.sysMethodsService.noWhitespaceValidator,
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
      identificationType: new FormControl('', [Validators.required]),
      identificationNo: new FormControl('', [
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(15),
        Validators.pattern(PatternValidation.WITHOUT_SPECIAL_CHARACTES_WITH_SPACE_PATTERN)
      ]),
      primaryContact: new FormControl('',
        [Validators.required, this.sysMethodsService.noWhitespaceValidator,
          Validators.pattern(PatternValidation.contactNumberValidation),
        ]),
      secondaryContact: new FormControl('', [Validators.pattern(PatternValidation.contactNumberValidation)]),
      email: new FormControl('',
        [Validators.required, this.sysMethodsService.noWhitespaceValidator,
          Validators.pattern(PatternValidation.emailValidation)]),
      userName: new FormControl('', [Validators.required, this.sysMethodsService.noWhitespaceValidator]),
      reason: new FormControl('', [
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255)
      ]),
      recaptcha: new FormControl('', Validators.required),
      officersDesignation: new FormControl('', [
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]),
      stateInstitutionName: new FormControl('', [
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]),
      otherInstitutionName: new FormControl('', [
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.nameValidation)
      ]),
    });


    this.bankName.valueChanges.subscribe(
      (value: any) => {
        if (value) this.getCurrentBank(value);
      }
    );

    this.bankBranch.valueChanges.subscribe(
      (value: any) => {
        if (value) this.selectBranch(value);
      }
    );

    this.IdentificationType1.valueChanges.subscribe(
      (value: any) => {
        if (value) this.getCurrentIdentificationType(value);
      }
    );

    this.type.valueChanges.subscribe(
      (value: any) => {
        if (value) {
          this.documentList = [];
          this.getCurrentUserType(value);
        }
      }
    );
    this.nearestLr.valueChanges.subscribe(
      (value: any) => {
        if (value) {
          this.getCurrentLandRegistry(value);
        }
      }
    );

    this.getAllLandRegistries();
    this.getAllBanks();
    this.getTempData();

    this.citizenDTO.userType = this.PublicUserType.CITIZEN;
    this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
    this.disableUselessFormControls(this.citizenDTO.userType);
  }

  getTempData() {

    let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.CITIZEN_REGISTRATION_KEY);
    if (tempDataId) {

      this.authorizeRequestService.getTempDataById(tempDataId).subscribe(
        (tempData:TempData) => {
          if(tempData){
            let requestData:RequestData = JSON.parse(tempData.tempData);

            this.publicUserForm.patchValue(JSON.parse(requestData.formData));
            this.recaptcha.setValue('');
            if (requestData.documentData)
              this.documentList = JSON.parse(requestData.documentData);
          }
        });
    }
  }

  setFiles(data: any, doc: any) {
    doc.selected = true;
    this.files = data;
    let document = this.isDocumentAvailable(doc.docTypeId);
    if (document) {
      let index = this.documentList.findIndex((data: DocumentDto) => {
        return data == document
      });
      if (data.length != 0) {
        this.documentList[index].files = this.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        let this2 = this;
        this2.documentList[index].fileName = this.files[0].name;
        this2.documentList[index].fileFormats = this.files[0].type;
        reader.onload = function () {
          this2.documentList[index].fileBase64 = reader.result;
        };
      } else {
        this.documentList.splice(index, 1);
      }
    } else {
      let newDoc = new DocumentDto(this.files[0], doc.docTypeId);
      newDoc.fileName = this.files[0].name;
      newDoc.fileFormats = this.files[0].type;

      let reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      reader.onload = function () {
        newDoc.fileBase64 = reader.result;
      };

      this.documentList.push(newDoc);
    }
    this.checkDocumentValidation();
  }

  checkDocumentValidation() {
    let invalid = false;
    this.docList.forEach((item: WorkflowStageDocDto) => {
      if (item.required && !this.isDocumentAvailable(item.docTypeId)) {
        item.invalid = true;
        invalid = true;
      } else {
        item.invalid = false;
      }
    });
    return invalid;
  }

  isDocumentAvailable(docTypeId: any): any {
    return this.documentList.find((data: DocumentDto) => {
        return data.fileType == docTypeId;
      }
    );
  }

  documentMarkAsTouched() {
    this.docList.forEach((item: WorkflowStageDocDto) => {
      if (item.required && !this.isDocumentAvailable(item.docTypeId)) {
        item.selected = true;
        item.error = false;
        item.invalid = true;
      }
    });

  }

  getAllLandRegistries() {
    this.authorizeRequestService.getAllLandRegistries()
      .subscribe((res) => {
          this.landRegistriesDTOList = res;
        },
        () => {
        },
        () => {
          this.isLrLoaded = true;
        });
  }

  getAllBanks() {
    this.authorizeRequestService.getAllBanks()
      .subscribe((result) => {
        this.banks = result;
      });
  }

  getCurrentLandRegistry(lrCode: number) {
    this.citizenDTO.landRegistry = lrCode;
  }

  getCurrentBank(event) {
    this.citizenDTO.bankId = event;
    // get bank branches
    this.getBankBranches(this.citizenDTO.bankId);
  }

  getBankBranches(bankId: number) {
    this.authorizeRequestService.findBankBranches(bankId).subscribe(
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

  getCurrentIdentificationType(value) {
    this.citizenDTO.identificationNoType = value;
    // set ref no validations
    // clear  identification with type change
    if (this.identificationNo.value) {
      this.identificationNo.setValue('');
    }
    if (value == IdentificationType.NIC) {
      this.identificationNo.setValidators([
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.NIC_PATTERN)
      ]);
    } else if (value == IdentificationType.PASSPORT) {
      this.identificationNo.setValidators([
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.PASSPORT_VALIDATION)
      ]);
    } else if (value == IdentificationType.DRIVING_LICENSE) {
      this.identificationNo.setValidators([
        Validators.required, this.sysMethodsService.noWhitespaceValidator,
        Validators.pattern(PatternValidation.DRIVING_LICENSE_VALIDATION)
      ]);
    }
    this.publicUserForm.updateValueAndValidity();
  }

  getCurrentUserType(userType: number) {
    this.docMetaList = [];
    this.isMadatoryDocsUploaded = false;
    this.citizenDTO.userType = userType;
    if (this.publicUserForm.disabled) {
      this.publicUserForm.enable();
    }
    this.disableUselessFormControls(this.citizenDTO.userType);

    if (this.citizenDTO.userType == PublicUserType.CITIZEN) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_INIT;
      this.workflowPayment = Parameters.CITIZEN_REGISTRATION_FEE;
    }
    else if (this.citizenDTO.userType == PublicUserType.BANK) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.BANK_INIT;
      this.workflowPayment = Parameters.BANK_REGISTRATION_FEE;
    }
    else if (this.citizenDTO.userType == PublicUserType.LAWYER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.LAWYER_OR_LAW_FIRM_INIT;
      this.workflowPayment = Parameters.LAWYER_LAW_FIRM_REGISTRATION_FEE;
    }
    else if (this.citizenDTO.userType == PublicUserType.STATE) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.STATE_INSTITUTE_INIT;
      this.workflowPayment = Parameters.STATE_INSTITUTE_REGISTRATION_FEE;
    }
    else if (this.citizenDTO.userType == PublicUserType.OTHER) {
      this.citizenDTO.workFlowStageCode = WorkflowStageCitizenReg.OTHER_INSTITUTE_INIT;
      this.workflowPayment = Parameters.OTHER_INSTITUTE_REGISTRATION_FEE;
    }
    this.getRelatedDocTypes(this.citizenDTO.workFlowStageCode);
  }

  getRelatedDocTypes(workflowStage: string) {
    this.authorizeRequestService.getRelatedDocTypes(workflowStage)
      .subscribe((result: any) => {
          this.workflowStageDocTypes = result;
          this.docList = result;
        }, (error) => {
        },
        () => {
          if (this.documentList.length > 0) {
            for (let document of this.documentList) {
              for (let doc of this.docList) {
                if (document.fileType == doc.docTypeId) {
                  doc.file = this.sysMethodsService.getFileFromDocumentDTO(document);
                  document.files = doc.file;
                  break;
                }
              }
            }
            this.checkDocumentValidation();
          }
        });
  }

  disableUselessFormControls(type: number) {
    this.publicUserForm.controls['bankName'].enable();
    this.publicUserForm.controls['bankBranch'].enable();
    this.publicUserForm.controls['lawFirmName'].enable();
    this.publicUserForm.controls['address1'].enable();
    this.publicUserForm.controls['address2'].enable();
    this.publicUserForm.controls['address3'].enable();
    this.publicUserForm.controls['stateInstitutionName'].enable();
    this.publicUserForm.controls['otherInstitutionName'].enable();
    this.officersDesignation.enable();

    if (type == this.PublicUserType.CITIZEN) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankBranch'].disable();
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
      this.publicUserForm.controls['bankBranch'].disable();
      this.publicUserForm.controls['stateInstitutionName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.STATE) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankBranch'].disable();
      this.publicUserForm.controls['lawFirmName'].disable();
      this.publicUserForm.controls['otherInstitutionName'].disable();
    }
    else if (type == this.PublicUserType.OTHER) {
      this.publicUserForm.controls['bankName'].disable();
      this.publicUserForm.controls['bankBranch'].disable();
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

    if (this.paymentMethod !== PaymentMethod.ONLINE) {

      this.authorizeRequestService.saveCitizenAndFormData(this.documentList, this.citizenDTO)
        .subscribe((result) => {
          if (result && this.paymentMethod !== PaymentMethod.ONLINE) {
            this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.REGISTRATION_SUCCESS'));
            this.router.navigate(['/login']);
            this.tokenStorageService.removeFormData(this.tokenStorageService.CITIZEN_REGISTRATION_KEY);
          } else {
            this.snackBar.error('Operation failed');
          }
        });
    } else if (this.paymentMethod === PaymentMethod.ONLINE) {

      let requestData = new RequestData();
      requestData.formData = JSON.stringify(this.publicUserForm.value);
      requestData.documentData = JSON.stringify(this.documentList);
      requestData.paymentData = JSON.stringify(this.paymentDto);
      requestData.otherData1 = JSON.stringify(this.citizenDTO);

      let tempData = new TempData();
      tempData.tempData = JSON.stringify(requestData);
      tempData.status = CommonStatus.ACTIVE;

      this.authorizeRequestService.saveTempData(tempData).subscribe(
        (tempData: TempData) => {
          this.tokenStorageService.saveFormData(this.tokenStorageService.CITIZEN_REGISTRATION_KEY, tempData.tempDataId);
          this.isContinue = true;
          this.statusOnlinePayment = true;
        }
      );


    }
  }

  onSearchChange(searchValue: string): void {
    this.publicUserDTO.username = searchValue;
    this.authorizeRequestService.checkForValidUsername(this.publicUserDTO).subscribe((result) => {
      if (result == true) {
        this.publicUserExist = true;
        this.email.setErrors({incorrect: true});
      } else {
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
    this.recaptcha.setValue('');
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
    this.errorMsg = undefined;
    if (this.publicUserForm.invalid || this.checkDocumentValidation()) {
      Object.keys(this.publicUserForm.controls).forEach(field => {
        const control = this.publicUserForm.get(field);
        control.markAsTouched({onlySelf: true});
      });
      this.documentMarkAsTouched();
      this.errorMsg = 'Please fill all mandatory fields!';
    }
    else {
      this.isContinue = true;
    }
  }

  checkFormValidity(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsDirty();
    });
  }

  getBase64(url: string): string {
    return btoa(url);
  }
}
