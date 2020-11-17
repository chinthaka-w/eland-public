import {Component, Input, OnInit} from '@angular/core';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc-dto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {JudicialService} from '../../../shared/service/change-judicial-service';
import {JudicialChangeWorkflowStagesEnum} from '../../../shared/enum/judicial-change-workflow-stages.enum';
import {LandRegistryChangeWorkflowStagesEnum} from '../../../shared/enum/land-registry-change-workflow-stages.enum';
import {PaymentDto} from '../../../shared/dto/payment-dto';
import {ChangeLandRegistryDto} from '../../../shared/dto/change-land-registry.dto';
import {JudicialChange} from '../../../shared/dto/judicial-change-model';
import {DocumentDto} from '../../../shared/dto/document-list';
import {ChangeLandRegistryService} from '../../../shared/service/change-land-registry.service';
import {PaymentMethod} from '../../../shared/enum/payment-method.enum';
import {PaymentResponse} from '../../../shared/dto/payment-response.model';
import {Parameters} from '../../../shared/enum/parameters.enum';
import {Workflow} from '../../../shared/enum/workflow.enum';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {SessionService} from '../../../shared/service/session.service';
import {Router} from '@angular/router';
import {WorkflowStageDocTypeDTO} from '../../../shared/dto/workflow-stage-doc-type-dto';
import {CommonStatus} from '../../../shared/enum/common-status.enum';
import {Location} from '@angular/common';
import {SystemService} from '../../../shared/service/system.service';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';

@Component({
  selector: 'app-change-land-registry',
  templateUrl: './change-land-registry.component.html',
  styleUrls: ['./change-land-registry.component.css']
})
export class ChangeLandRegistryComponent implements OnInit {
  @Input() workflow: string;
  public docList: WorkflowStageDocDto[];
  workflowStageDocTypes: Array<WorkflowStageDocTypeDTO> = [];
  landRegistryChangeForm: FormGroup;
  public landRegistrySelect: LandRegistryModel[];
  isContinue = false;
  public paymentId: number;
  public isPaymentSuccess: boolean;
  returnURl: string;
  paymentMethod: number;
  paymentDto: PaymentDto = new PaymentDto();
  statusOnlinePayment: boolean;
  public changelandregistry = new ChangeLandRegistryDto();
  public documentList: DocumentDto[] = [];
  Parameters = Parameters;
  WorkflowCode = LandRegistryChangeWorkflowStagesEnum;
  public files: File[] = [];
  public notaryId: number;
  user: string;
  userType: string;
  userId: number;
  isRequiredDocsUpload = false;
  isContinueToPayment:boolean;



  constructor( private judicialService: JudicialService,
               private changelandRegistryService: ChangeLandRegistryService,
               private snackBar: SnackBarService,
               private sessionService: SessionService,
               private router: Router,
               private location: Location,
               private sysMethodsService: SysMethodsService,
               private systemService: SystemService) { }

  ngOnInit() {
    this.landRegistryChangeForm = new FormGroup({
      reason: new FormControl('', [Validators.required,
        this.sysMethodsService.noWhitespaceValidator ,
        Validators.maxLength(255)] ),
      landRegistry: new FormControl('', Validators.required )
    });
    this.notaryId = this.sessionService.getUser().id;
    this.getLandRegistries();
    this.getDocumentList();
    this.userType = this.sessionService.getUser().type;
    this.userId = this.sessionService.getUser().id;
  }

  saveRequest() {
  this.changelandregistry.landRegistryId = this.landRegistryChangeForm.value.landRegistry;
  this.changelandregistry.reasonForChange = this.landRegistryChangeForm.value.reason;
  this.changelandregistry.notaryRequestId = this.notaryId;

  const formData = new FormData();
  formData.append('data', JSON.stringify(this.changelandregistry));
  this.documentList.forEach(doc => {
      formData.append('file', doc.files, doc.files.name + '|' + doc.fileType);
    });
  // this.changelandRegistryService.save(formData).subscribe((result) => {
  //   if (this.paymentMethod !== PaymentMethod.ONLINE) {
  //     this.snackBar.success('Judicial Change Request Success');
  //    // this.router.navigate(['/requests', this.getBase64Url(Workflow.JUDICIAL_ZONE_CHANGE)]);
  //     this.router.navigate(['/requests', btoa(Workflow.CHANGE_LAND_REGISTRY)]);
  //   } else if (this.paymentMethod === PaymentMethod.ONLINE) {
  //     this.snackBar.success('Judicial Change Request Success, Proceed to online payment');
  //     this.isContinue = true;
  //     this.statusOnlinePayment = true;
  //     this.returnURl = 'requests/' + btoa(Workflow.CHANGE_LAND_REGISTRY);
  //
  //   } else {
  //     this.snackBar.error('Operation failed');
  //   }
  // });

  this.changelandRegistryService.save(formData).subscribe(
    (success: string ) => {
      this.snackBar.success(this.systemService.getTranslation('CHG_LANDREG.SUCCESS_LR'));
      this.router.navigate(['/requests', btoa(Workflow.CHANGE_LAND_REGISTRY)]);
      },
      error1 => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.FAILED'));
      } );
  }


  private getLandRegistries(): void {
    this.judicialService.getAllLandRegistriesByJudicialZone(this.notaryId).subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistrySelect = data;
      }
    );
  }

  private getDocumentList(): void {
    this.judicialService.getDocuments(LandRegistryChangeWorkflowStagesEnum.LANDREGISTRY_CHANGE_REQUEST_INITIATED).subscribe(
      (data: WorkflowStageDocTypeDTO[]) => {
        // alert(this.docList);
        this.workflowStageDocTypes = data;
      }
    );
  }
  onPaymentResponse(data: PaymentResponse) {

    if (this.paymentMethod !== PaymentMethod.ONLINE) {
      this.paymentDto.paymentId = data.paymentId;
      this.changelandregistry.payment = this.paymentDto;
      this.saveRequest();
    }
  }

  paymentMethodResponse(data: PaymentResponse) {
    this.paymentMethod = data.paymentMethod;

    // save citizen form for online payment with reference no
    if (this.paymentMethod === PaymentMethod.ONLINE) {

      this.paymentDto.referenceNo = data.transactionRef;
      this.paymentDto.applicationAmount = +data.applicationAmount;
      this.changelandregistry.payment = this.paymentDto;
      this.saveRequest();
    }

  }

  // setFiles(data: any, docTyprId: number) {
  //   this.files = data;
  //   this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  // }

  setFiles(data: any, docTyprId: number, status: boolean) {
    this.files = data;
    const document = new DocumentDto(this.files[0], docTyprId);
    document.status = status ? CommonStatus.REQUIRED : CommonStatus.OPTIONAL;
    if (document.files) {
      this.documentList.push(document);
    } else {
      this.documentList.forEach((doc, index) => {
        if (doc.fileType === document.fileType) {
          this.documentList.splice(index, 1);
        }
      });
    }

    let workflowManatoryDocs = 0;
    let uploadedMandatoryDocs = 0;

    this.workflowStageDocTypes.forEach(doc => {
      if  (doc.required) {
        workflowManatoryDocs += 1;
      }
    });

    this.documentList.forEach(doc => {
      if (doc.status === CommonStatus.REQUIRED) {
        uploadedMandatoryDocs += 1;
      }
    });

    if (workflowManatoryDocs === uploadedMandatoryDocs) {
      this.isRequiredDocsUpload = true;
    } else {
      this.isRequiredDocsUpload = false; }
  }

  onBack(data: boolean) {
    this.isContinue = !data;
  }

  continue(): void {

    this.saveRequest();

  }

  get reason() {
    return this.landRegistryChangeForm.get('reason');
  }
  get landRegistry() {
    return this.landRegistryChangeForm.get('landRegistry');
  }

  goBack(): any {
    this.location.back();
    return false;
  }

}
