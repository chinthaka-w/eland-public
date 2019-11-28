import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {JudicialService} from '../../../shared/service/change-judicial-service';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {GnDivisionDTO} from '../../../shared/dto/gn-division-dto';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc-dto';
import {WorkflowStageEnum} from '../../../shared/enum/workflow-stage.enum';
import {Languages} from '../../../shared/enum/languages.enum';
import {JudicialChange} from '../../../shared/dto/judicial-change-model';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {FileModel} from '../../../shared/dto/file.dto';
import {DatePipe} from '@angular/common';
import {DsGnDivisionDTO} from '../../../shared/dto/gs-gn-model';

@Component({
  selector: 'app-change-judicial',
  templateUrl: './change-judicial.component.html',
  styleUrls: ['./change-judicial.component.css']
})
export class ChangeJudicialComponent implements OnInit {
  public landRegistry: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];
  public locationList: any[] = [];
  public previousSelections: any[] = [];
  public locationDto: any = {};
  public gsDivisions: DsDivision[];
  public gnDivisions: GnDivisionDTO[];
  public isSelected: boolean;
  judicialChangeForm: FormGroup;
  public docList: WorkflowStageDocDto[];
  fileList = {};
  public notaryId: number;
  public langArr: number[];
  public isSinhala: boolean;
  public isTamil: boolean;
  public isEnglish: boolean;
  public fileDtoList: FormData[];
  public fromDate: string;
  public toDate: string;
  public dsDivisionId: number;
  public gsGn: DsGnDivisionDTO;
  public gnDivi: string[];
  public dsGnList: DsGnDivisionDTO[] = [];
  @Input()
  response = new EventEmitter;
  fileToUpload: File = null;
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


  constructor(private judicialService: JudicialService, private snackBar: SnackBarService, public datePipe: DatePipe) { }

  ngOnInit() {
    this.judicialChangeForm = new FormGroup({
      addressEng: new FormControl("", [Validators.required]),
      addressSin: new FormControl("", [Validators.required]),
      addressTam: new FormControl("", [Validators.required]),
      notarialWorkStartDate: new FormControl("", [Validators.required]),
      certificateYear: new FormControl("", [Validators.required]),
      nameOfLr: new FormControl("", [Validators.required]),
      isDuplicateHandedOver: new FormControl("", [Validators.required]),
      datePeriod: new FormControl("", [Validators.required]),
      judicialZoneId: new FormControl("", [Validators.required]),
      landRegistry: new FormControl("", [Validators.required]),
     });
    this.isSinhala = false;
    this.isTamil = false;
    this.isEnglish = false;
    this.notaryId = 1;
    this.getLandRegistries();
    this.getJudicialZone();
    this.getDsDivision();
    this.getDocumentList();
    this.locationList.push(this.locationDto);
    this.getLanguages();



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
        this.landRegistry = data;
      }
    );
  }

  private getJudicialZone(): void {
    this.judicialService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZone = data;
      }
    );
  }

  private getDocumentList(): void {
    this.judicialService.getDocuments(WorkflowStageEnum.JUDICIAL_CHANGE_REQUEST_INITIALIZED).subscribe(
      (data: WorkflowStageDocDto[]) => {
        this.docList = data;
      }
    );
  }

  private getLanguages(): void {
    this.judicialService.getLanguages(this.notaryId).subscribe(
      (data: number[]) => {
        this.langArr = data;
        for (const langId of this.langArr) {
          if (langId === Languages.ENGLISH) { this.isEnglish = true; }
          if (langId === Languages.SINHALA) { this.isSinhala = true; }
          if (langId === Languages.TAMIL) { this.isTamil = true; }
        }
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
      if (gsDivision.divisionId === this.locationList[index].gsDivision) {
        this.isSelected = false;
      }
    });
    this.locationList.splice(index, 1);
    this.previousSelections.splice(index, 1);
  }

  selectGsDivision(gsDivisionId, index) {
    this.dsDivisionId = gsDivisionId;
    this.getGnDivision(gsDivisionId);
    this.gsDivisions.forEach(gsDivision => {
      if (gsDivision.divisionId === gsDivisionId) {
        this.isSelected = true;
      }
      if (gsDivision.divisionId === this.previousSelections[index]) {
        this.isSelected = false;
      }
    });
    this.previousSelections[index] = gsDivisionId;
  }

  selectGnDivision(gsDivisionId) {
   this.dsGnList.push(new DsGnDivisionDTO(1, 2));
  }

  setFiles(event) {
    // console.log('ok...............',event);
    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(event.target.files[i]);
    //   }
    //   this.filedata = event.target.files;
    //   let uploadFile: File = this.filedata.item(0);
    //   const formdata: FormData = new FormData();
    //   formdata.append('file', uploadFile);
    //   this.fileDtoList.push(formdata);
    //
    // }
  }

  submitForm() {

    const judicial: JudicialChange = new JudicialChange(
      this.judicialChangeForm.value.judicialZoneId,
      null,
      0,
      null,
      null,
      this.judicialChangeForm.value.addressEng,
      this.judicialChangeForm.value.addressSin,
      this.judicialChangeForm.value.addressTam,
      this.judicialChangeForm.value.notarialWorkStartDate,
      this.judicialChangeForm.value.certificateYear,
      this.judicialChangeForm.value.nameOfLr,
      this.judicialChangeForm.value.isDuplicateHandedOver,
      this.judicialChangeForm.value.judicialZoneId,
      this.judicialChangeForm.value.landRegistry,
      this.fileDtoList,
      this.fromDate,
      this.toDate,
      this.notaryId,
      this.dsGnList,
     );

    this.judicialService.save(judicial).subscribe(
      (success: string) => {
        this.snackBar.success('Judicial Change Request Success');
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  saveDate(event: any) {
    this.fromDate = event.target.value.begin;
    this.toDate = event.target.value.end;
  }

 }
