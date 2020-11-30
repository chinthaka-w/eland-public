import {CommonStatus} from 'src/app/shared/enum/common-status.enum';
import {Workflow} from './../../../shared/enum/workflow.enum';
import {Router} from '@angular/router';
import {PatternValidation} from './../../../shared/enum/pattern-validation.enum';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {JudicialService} from '../../../shared/service/change-judicial-service';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc-dto';
import {Languages} from '../../../shared/enum/languages.enum';
import {JudicialChange} from '../../../shared/dto/judicial-change-model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {DsGnDivisionDTO} from '../../../shared/dto/gs-gn-model';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {DocumentDto} from '../../../shared/dto/document-list';
import {JudicialChangeWorkflowStagesEnum} from '../../../shared/enum/judicial-change-workflow-stages.enum';
import {GnDivisionDTO} from '../../../shared/dto/gn-division.dto';
import {SessionService} from '../../../shared/service/session.service';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PaymentDto} from '../../../shared/dto/payment-dto';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {AuthorizeRequestService} from '../../../shared/service/authorize-request.service';
import {TempData} from '../../../shared/dto/temp-data.model';
import {RequestData} from '../../../shared/dto/request-data.model';

@Component({
  selector: 'app-change-judicial',
  templateUrl: './change-judicial.component.html',
  styleUrls: ['./change-judicial.component.css']
})
export class ChangeJudicialComponent implements OnInit {
  public landRegistries: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];
  public locationList: any[] = [];
  public previousSelections: any[] = [];
  public locationDto: any = {};
  public gsDivisions: DsDivision[];
  public gnDivisions: GnDivisionDTO[];
  public isSelected: boolean;
  judicialChangeForm: FormGroup;
  public docList: WorkflowStageDocDto[];
  public notaryId: number;
  public langArr: number[];
  public isSinhala = false;
  public isTamil = false;
  public isEnglish = false;
  public fromDate: Date;
  public toDate: Date;
  public dsDivisionId: number;
  public dsGnList: DsGnDivisionDTO[] = [];
  public isContinueToPayment: boolean = false;
  Parameters = Parameters;
  WorkflowCode = JudicialChangeWorkflowStagesEnum;
  Workflow = Workflow;
  public paymentId: number;
  public isPaymentSuccess: boolean;
  public files: File[] = [];
  public documentList: DocumentDto[] = [];
  public judicialChange = new JudicialChange;
  isContinue: boolean = false;
  returnURl: string;
  paymentMethod: number;
  paymentDto: PaymentDto = new PaymentDto();
  statusOnlinePayment: boolean;
  isRequiredDocsUpload = false;
  userType: string;
  userId: number;
  workflowStageCode: string;
  isAddEngMandatory = false;
  isAddSinMandatory = false;
  isAddTamMandatory = false;

  public languages: any[] = [
    {
      id: Languages.ENGLISH,
      description: 'English'
    },
    {
      id: Languages.SINHALA,
      description: 'Sinhala'
    },
    {
      id: Languages.TAMIL,
      description: 'Tamil'
    }
  ];

  get addressEng() {
    return this.judicialChangeForm.get('addressEng');
  }

  get addressSin() {
    return this.judicialChangeForm.get('addressSin');
  }

  get addressTam() {
    return this.judicialChangeForm.get('addressTam');
  }

  get judicialZoneId() {
    return this.judicialChangeForm.get('judicialZoneId');
  }

  get landRegistry() {
    return this.judicialChangeForm.get('landRegistry');
  }

  get dsDivision() {
    return this.judicialChangeForm.get('dsDivision');
  }

  get gnDivision() {
    return this.judicialChangeForm.get('gnDivision');
  }

  get recaptcha() {
    return this.judicialChangeForm.get('recaptcha');
  }

  constructor(
    private judicialService: JudicialService,
    private location: Location,
    private snackBar: SnackBarService,
    private sessionService: SessionService,
    private sysMethodsService: SysMethodsService,
    private formBuilder: FormBuilder,
    private authorizeRequestService: AuthorizeRequestService,
    private tokenStorageService: TokenStorageService,
    private router: Router) {
  }

  ngOnInit() {
    this.judicialChangeForm = this.formBuilder.group({
      addressEng: ['', [
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)
      ]],
      addressSin: ['', [
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)
      ]],
      addressTam: ['', [
        Validators.maxLength(255),
        Validators.pattern(PatternValidation.ADDRESS_PATTERN)
      ]],
      judicialZoneId: ['', [
        Validators.required
      ]],
      landRegistry: ['', [Validators.required]],
      dsDivision: ['', [Validators.required]],
      gnDivision: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]
    });

    this.notaryId = this.sessionService.getUser().id;
    this.getJudicialZone();
    this.locationList.push(this.locationDto);
    this.judicialZoneId.valueChanges.subscribe(value => {
      if (value) this.onSelectJudicial(value);
    });
    this.landRegistry.valueChanges.subscribe(value => {
      if (value) this.getDsDivisions(value);
    });
    this.dsDivision.valueChanges.subscribe(value => {
      if (value) this.selectGsDivision(value);
    });
    this.getLanguages();
    this.isPaymentSuccess = false;
    this.isContinueToPayment = false;
    this.userType = this.sessionService.getUser().type;
    this.userId = this.sessionService.getUser().id;
    this.workflowStageCode = JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIATED;

  }

  getTempData() {

    let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_JUDICIAL_CHANGE_KEY);
    if (tempDataId) {
      this.authorizeRequestService.getTempDataById(tempDataId).subscribe(
        (tempData: TempData) => {
          if (tempData) {
            let requestData: RequestData = JSON.parse(tempData.tempData);
            this.judicialChangeForm.patchValue(JSON.parse(requestData.formData));
            this.recaptcha.setValue('');
            if (requestData.documentData)
              this.documentList = JSON.parse(requestData.documentData);
            if(requestData.otherData1){
              let judicialChange: JudicialChange = JSON.parse(requestData.otherData1);
             this.dsGnList = judicialChange.dsGnList;
              this.gnDivision.setValue(this.dsGnList.map(a => a.gnDivision));
            }
          }
        }, (error) => {
        },
        () => {
          this.getDocumentList();
        });
    } else {
      this.getDocumentList();
    }
  }

  getDsDivisions(landRegistryId: number): void {
    this.judicialService.getDsDivisionsByLR(landRegistryId).subscribe(
      (data: DsDivision[]) => {
        this.gsDivisions = data;
      }
    );
  }

  public getGnDivision(dsDivId: number): void {
    this.judicialService.getGnDivision(dsDivId).subscribe(
      (data: GnDivisionDTO[]) => {
        this.gnDivisions = data;
      }
    );
  }

  public getLandRegistries(judicialCode: number): void {
    this.judicialService.getAllLandRegistries().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistries = data;
      }
    );
  }

  getLandRegistriesByJudicial(judicalCode: number) {
    this.judicialService.getLandRegistriesByJudicialZone(judicalCode).subscribe(
      (response) => {
        this.landRegistries = response;
      }
    );
  }

  public getJudicialZone(): void {
    this.judicialService.getAllJudicialZoneWithoutNotaryReg(this.notaryId).subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZone = data;
      }
    );
  }

  private getDocumentList(): void {
    this.judicialService.getDocuments(JudicialChangeWorkflowStagesEnum.JUDICIAL_CHANGE_REQUEST_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
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
      }
    );
  }

  public getLanguages(): void {
    this.judicialService.getLanguages(this.notaryId).subscribe(
      (data: number[]) => {
        this.langArr = data;
        for (const langId of this.langArr) {
          if (langId === Languages.ENGLISH) {
            this.isEnglish = true;
            this.addressEng.setValidators([
              Validators.required,
              this.sysMethodsService.noWhitespaceValidator,
              Validators.maxLength(255),
              Validators.pattern(PatternValidation.ADDRESS_PATTERN)
            ]);
            this.addressEng.updateValueAndValidity();
            this.isAddEngMandatory = true;
          }
          if (langId === Languages.SINHALA) {
            this.isSinhala = true;
            this.addressSin.setValidators([
              Validators.required,
              this.sysMethodsService.noWhitespaceValidator,
              Validators.maxLength(255),
              Validators.pattern(PatternValidation.ADDRESS_PATTERN)
            ]);
            this.addressSin.updateValueAndValidity();
            this.isAddSinMandatory = true;
          }
          if (langId === Languages.TAMIL) {
            this.isTamil = true;
            this.addressTam.setValidators([
              Validators.required,
              this.sysMethodsService.noWhitespaceValidator,
              Validators.maxLength(255),
              Validators.pattern(PatternValidation.ADDRESS_PATTERN)
            ]);
            this.addressTam.updateValueAndValidity();
            this.isAddTamMandatory = true;
          }
        }
      }, (error) => {
      },
      () => {
        this.getTempData();
      }
    );
  }

  addLocation() {
    this.locationList.push(this.locationDto);
    this.previousSelections.push(-1);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.gsDivisions.forEach(gsDivision => {
      if (gsDivision.dsDivisionId === this.locationList[index].gsDivision) {
        this.isSelected = false;
      }
    });
    this.locationList.splice(index, 1);
    this.previousSelections.splice(index, 1);
  }

  selectGsDivision(gsDivisionId) {
    this.dsDivisionId = gsDivisionId;
    this.getGnDivision(gsDivisionId);
    // this.gsDivisions.forEach(gsDivision => {
    //   if (gsDivision.dsDivisionId === gsDivisionId) {
    //     this.isSelected = true;
    //   }
    //   if (gsDivision.dsDivisionId === this.previousSelections[index]) {
    //     this.isSelected = false;
    //   }
    // });
    // this.previousSelections[index] = gsDivisionId;
  }


  selectGnDivision(gsDivisions) {
    this.dsGnList = [];
    gsDivisions.value.forEach((gsDivision, index) => {
      this.dsGnList.push(new DsGnDivisionDTO(+this.dsDivisionId, +gsDivision));
    });
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

  submitForm() {

    this.judicialChange.judicialZoneId = this.judicialChangeForm.value.judicialZoneId;
    this.judicialChange.addressEng = this.judicialChangeForm.value.addressEng;
    this.judicialChange.addressSin = this.judicialChangeForm.value.addressSin;
    this.judicialChange.addressTam = this.judicialChangeForm.value.addressTam;
    this.judicialChange.landRegistry = this.judicialChangeForm.value.landRegistry;
    this.judicialChange.newNotaryId = this.notaryId;
    this.judicialChange.dsGnList = this.dsGnList;
    this.judicialChange.paymentId = this.paymentId;

    if (this.paymentMethod === PaymentMethod.ONLINE) {

      let requestData = new RequestData();
      requestData.formData = JSON.stringify(this.judicialChangeForm.value);
      requestData.documentData = JSON.stringify(this.documentList);
      requestData.paymentData = JSON.stringify(this.paymentDto);
      requestData.otherData1 = JSON.stringify(this.judicialChange);

      let tempData = new TempData();
      tempData.tempData = JSON.stringify(requestData);
      tempData.status = CommonStatus.ACTIVE;

      this.authorizeRequestService.saveTempData(tempData).subscribe(
        (tempData: TempData) => {
          this.tokenStorageService.saveFormData(this.tokenStorageService.NEW_NOTARY_JUDICIAL_CHANGE_KEY, tempData.tempDataId);
          this.isContinue = true;
          this.statusOnlinePayment = true;
        }
      );

    }else {
      this.judicialService.save(this.documentList, this.judicialChange).subscribe((result) => {
        if (result && this.paymentMethod !== PaymentMethod.ONLINE) {
          this.snackBar.success('Judicial Change Request Success');
          let tempDataId = this.tokenStorageService.getFormData(this.tokenStorageService.NEW_NOTARY_JUDICIAL_CHANGE_KEY);
          if (tempDataId) {
            this.authorizeRequestService.deleteTempData(tempDataId).subscribe();
            this.tokenStorageService.removeFormData(this.tokenStorageService.NEW_NOTARY_JUDICIAL_CHANGE_KEY);
          }
          this.router.navigate(['/requests', this.getBase64Url(Workflow.JUDICIAL_ZONE_CHANGE)]);
        } else if (this.paymentMethod === PaymentMethod.ONLINE) {
          this.snackBar.success('Judicial Change Request Success, Proceed to online payment');
          this.isContinue = true;
          this.statusOnlinePayment = true;
        } else {
          this.snackBar.error('Operation failed');
        }
      });
    }
  }

  saveDate(event: any) {
    this.fromDate = event.target.value.begin;
    this.toDate = event.target.value.end;
  }

  get FormControls() {
    return this.judicialChangeForm.controls;
  }

  onClickSubmitSearchRequest() {
    this.isContinueToPayment = !this.isContinueToPayment;
  }

  onPaymentResponse(data: PaymentResponse) {
    if (this.paymentMethod !== PaymentMethod.ONLINE) {
      this.paymentDto.paymentId = data.paymentId;
      this.judicialChange.payment = this.paymentDto;
      this.submitForm();
    }
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    // save citizen form for online payment with reference no
    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.returnURl = 'requests/' + this.getBase64Url(Workflow.JUDICIAL_ZONE_CHANGE);
      this.judicialChange.payment = this.paymentDto;
      this.submitForm();
    }

  }

  onBack(data: boolean) {
    this.isContinue = !data;
    this.recaptcha.setValue(null);
  }

  goBack(): any {
    this.location.back();
    return false;
  }

  continue(): void {
    this.isContinue = true;
  }

  onSelectJudicial(judicialCode: any) {
    this.getLandRegistriesByJudicial(judicialCode);
    this.gsDivisions = [];
    this.gnDivisions = [];
    this.landRegistry.setValue('');
    this.dsDivision.setValue('');
    this.gnDivision.setValue('');
    this.judicialChangeForm.updateValueAndValidity();
  }

  getBase64Url(url: string): string {
    return btoa(url);
  }
}
