import { SystemService } from './../../../../../shared/service/system.service';
import { SessionService } from './../../../../../shared/service/session.service';
import { TokenStorageService } from './../../../../../shared/auth/token-storage.service';
import { PatternValidation } from 'src/app/shared/enum/pattern-validation.enum';
import { Workflow } from './../../../../../shared/enum/workflow.enum';
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {JudicialChange} from '../../../../../shared/dto/judicial-change-model';
import {JudicialService} from '../../../../../shared/service/change-judicial-service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {JudicialZoneModel} from '../../../../../shared/dto/judicial-zone.model';
import {LandRegistryModel} from '../../../../../shared/dto/land-registry.model.';
import {DsDivision} from '../../../../../shared/dto/ds-division.model';
import {GnDivisionDTO} from '../../../../../shared/dto/gn-division.dto';
import {NewNotaryDsDivisionDTO} from '../../../../../shared/dto/new-notary-ds-division.model';
import {SnackBarService} from '../../../../../shared/service/snack-bar.service';
import {Languages} from '../../../../../shared/enum/languages.enum';
import {DsGnDivisionDTO} from '../../../../../shared/dto/gs-gn-model';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DocumentDto} from '../../../../../shared/dto/document-list';
import {JudicialChangeWorkflowStagesEnum} from '../../../../../shared/enum/judicial-change-workflow-stages.enum';
import {NewNotaryRequestsCategorySearchDto} from '../../../../../shared/dto/new-notary-requests-category-search.dto';
import {NewNotaryPaymentDetailDto} from '../../../../../shared/dto/new-notary-payment-detail.dto';
import {NewNotaryDataVarificationService} from '../../../../../shared/service/new-notary-data-varification.service';
import {WorkflowStageDocDto} from '../../../../../shared/dto/workflow-stage-doc.dto';
import {SupportingDocService} from '../../../../../shared/service/supporting-doc.service';
import {Notary} from '../../../../../shared/dto/notary.model';

@Component({
  selector: 'app-request-data',
  templateUrl: './request-data.component.html',
  styleUrls: ['./request-data.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class RequestDataComponent implements OnInit {
  @Input() workflow: string;
  @Input() id: number;
  workflowCode = Workflow.JUDICIAL_ZONE_CHANGE;
  public judicialChange: JudicialChange;
  requestForm: FormGroup;
  public gsDivisions: DsDivision[];
  public gnDivisions: GnDivisionDTO[];
  public landRegistries: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];
  public locationList: any[] = [];
  public previousSelections: any[] = [];
  public locationDto: any = {};
  public judicialChangeDto = new JudicialChange;
  public notaryId: number;
  public langArr: number[];
  public isSinhala: boolean;
  public isTamil: boolean;
  public isEnglish: boolean;
  public dsGnList: DsGnDivisionDTO[] = [];
  public dsGnDivisions: NewNotaryDsDivisionDTO[] = [];
  public dsDivisionId: number;
  public isSelected: boolean;
  @Input() files: File[] = [];
  public documentList: DocumentDto[] = [];
  paymentDetails: NewNotaryPaymentDetailDto[] = [];
  paymentId: number;
  public docList: WorkflowStageDocDto[];
  @Output() jdDetail = new EventEmitter<JudicialChange>();
  enbleFormEdit = false;
  requestedGnDivisions = [];
  @Input() showSpinner = false;
  isButtonDissable = false;
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

  constructor(private judicialZoneService: JudicialService,
              private judicialService: JudicialService,
              private snackBar: SnackBarService,
              private newNotaryDataVarificationService: NewNotaryDataVarificationService,
              private documetService: SupportingDocService,
              private formBuilder: FormBuilder,
              private sessionService: SessionService,
              private systemService: SystemService) { }

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
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
      judicialZoneId: ['', [Validators.required]],
      landRegistry: ['', [Validators.required]],
      dsDivision: ['', [Validators.required]],
      gnDivision: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]

    });
    this.notaryId = this.sessionService.getUser().id;
    this.locationList.push(this.locationDto);
    this.getJudicialZone();
    this.getDsDivision();
    this.getJudicialChangeDetails(this.id);
    this.getLanguages();
    this.isSelected = false;
    this.getDocumentList();
    this.locationDto = {};
  }

  get addressEng() {
    return this.requestForm.get('addressEng');
  }
  get addressSin() {
    return this.requestForm.get('addressSin');
  }
  get addressTam() {
    return this.requestForm.get('addressTam');
  }

  get dsDivision() {
    return this.requestForm.get('dsDivision');
  }

  get judicialZoneId() {
    return this.requestForm.get('judicialZoneId');
  }

  get landRegistry() {
    return this.requestForm.get('landRegistry');
  }

  get gnDivision() {
    return this.requestForm.get('gnDivision');
  }

  setFiles(data: any, docTyprId: number) {
    this.files = data;
    this.documentList.push(new DocumentDto(this.files[0], docTyprId));
  }

  addLocation() {
    this.locationList.push(this.locationDto);
    this.locationDto = {};
  }

  removeLocation(index) {
    this.locationList.splice(index, 1);
  }


  private getDsDivision(): void {
    this.judicialService.getDsDivision().subscribe(
      (data: DsDivision[]) => {
        this.gsDivisions = data;
      }
    );
  }

  private getGnDivision(dsDivId: number): void {
    this.judicialService.getGnDivision(dsDivId).subscribe(
      (data: GnDivisionDTO[]) => {
        this.gnDivisions = data;
      }
    );
  }

  private getLandRegistries(): void {
    this.judicialService.getAllLandRegistries().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistries = data;
      }
    );
  }

  private getJudicialZone(): void {
    this.judicialService.getAllJudicialZoneWithoutNotaryReg(this.notaryId).subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZone = data;
      }
    );
  }

  private getLanguages(): void {
    this.judicialService.getLanguages(this.notaryId).subscribe(
      (data: number[]) => {
        this.langArr = data;
        for (const langId of this.langArr) {
          if (langId === Languages.ENGLISH) {
            this.isEnglish = true;
            this.addressEng.setValidators([
              Validators.required,
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
              Validators.maxLength(255),
              Validators.pattern(PatternValidation.ADDRESS_PATTERN)
            ]);
            this.addressTam.updateValueAndValidity();
            this.isAddTamMandatory = true;
          }
        }
      }
    );
  }

  private getJudicialChangeDetails(id): void {
    this.judicialZoneService.getRequestData(id).subscribe(
      (data: JudicialChange) => {
        this.judicialChange = data;
        console.log('judicial data: ', data);
        this.getGnDivision(this.judicialChange.newNotaryDsDivisionDTO[0].dsDivisionId);
        if (this.workflow === JudicialChangeWorkflowStagesEnum.DATA_VERIFICATION_CLERK_REJECTED) {
          this.setRequestedGnDivisions(this.judicialChange.newNotaryDsDivisionDTO);
        }
        // get lr divisions
        this.getLandRegistriesByJudicialCode(this.judicialChange.judicialZoneId);
        this.dsGnDivisions = this.judicialChange.newNotaryDsDivisionDTO;
        if (this.workflow === JudicialChangeWorkflowStagesEnum.DATA_VERIFICATION_CLERK_REJECTED) {
          this.requestForm.enable();
          this.enbleFormEdit = true;
        } else {
          this.requestForm.disable();
        }
      }
    );
  }

  setRequestedGnDivisions(gnDivisions: NewNotaryDsDivisionDTO[]) {
    this.requestedGnDivisions = [];
    gnDivisions.forEach(item => {
      this.requestedGnDivisions.push(item.gnDivisions[0].gnDivisionId.toString());
    });
  }

  submitForm() {
    this.isButtonDissable = true;
    if (this.requestForm.invalid) {
      this.snackBar.warn(this.systemService.getTranslation('VALIDATION.REQUIRED_FIELD_ERR'));
      this.isButtonDissable = false;
      return;
    }
    this.judicialChangeDto = this.requestForm.value;
    this.judicialChangeDto.newNotaryId = this.notaryId;
    this.judicialChangeDto.dsGnList = this.dsGnList;
    this.judicialChangeDto.requestId = this.id;
    this.jdDetail.emit(this.judicialChangeDto);
    this.isButtonDissable = false;
  }

  selectGsDivision(gsDivisionId) {
    this.getGnDivision(gsDivisionId);
    this.gnDivision.setValue('');
  }

  selectGnDivision(gnDivisions) {
    // add GN Divisions
    this.dsGnList = [];
    gnDivisions.value.forEach((gnDivisionId, index) => {
      this.dsGnList.push(new DsGnDivisionDTO(+this.dsDivision.value, +gnDivisionId));
    });
  }

  getPaymentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.id, this.workflow);
    this.newNotaryDataVarificationService.getPaymentDetails(searchType).subscribe(
      (result: NewNotaryPaymentDetailDto[]) => {
        this.paymentDetails = result;
        this.paymentId = this.paymentDetails[0].paymentId;
      },
      error => {
        console.log(error);
      }
    )
  }

  private getDocumentList(): void {
    this.documetService.getDocuments(Workflow.JUDICIAL_ZONE_CHANGE).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  setWorkflowStage(){
    let stageCode: string = this.judicialChange.workflowCode;
    this.newNotaryDataVarificationService.setWorkflowStage(stageCode);
  }

  getLandRegistriesByJudicialCode(judicialCode: number) {
    this.judicialService.getLandRegistriesByJudicialZone(judicialCode).subscribe(
      (response) => {
        this.landRegistries = response;
        this.requestForm.patchValue(
          {
            addressEng: this.judicialChange.addressEng,
            addressSin: this.judicialChange.addressSin,
            addressTam: this.judicialChange.addressTam,
            judicialZoneId: this.judicialChange.judicialZoneId,
            landRegistry: this.judicialChange.landRegistry.toString(),
            dsDivision: this.judicialChange.newNotaryDsDivisionDTO[0].dsDivisionId.toString(),
            gnDivision: this.requestedGnDivisions
          }
        );
      }
    );
  }

  onChangeJudicialZone(judicialZoneCode: number) {
    this.judicialService.getLandRegistriesByJudicialZone(judicialZoneCode).subscribe(
      (response) => {
        this.landRegistries = response;
      }
    );
    this.gsDivisions = [];
    this.gnDivisions = [];
    this.landRegistry.setValue('');
    this.dsDivision.setValue('');
    this.gnDivision.setValue('');
    this.requestForm.updateValueAndValidity();
  }

  getDsDivisions(lrId: number) {
    console.log('on change lr');
    this.judicialService.getDsDivisionsByLR(lrId).subscribe(
      (data: DsDivision[]) => {
        this.gsDivisions = data;
      }
    );
  }

  public onFormSubmit() {
    this.submitForm();
  }
}
