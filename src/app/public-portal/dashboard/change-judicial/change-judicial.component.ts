import { Component, OnInit } from '@angular/core';

import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {JudicialService} from '../../../shared/service/change-judicial-service';
import {DsDivision} from '../../../shared/dto/ds-division.model';
import {GnDivisionDTO} from '../../../shared/dto/gn-division-dto';
import {LandRegistryModel} from '../../../shared/dto/land-registry.model.';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkflowStageDocDto} from '../../../shared/dto/workflow-stage-doc-dto';
import {WorkflowStageEnum} from '../../../shared/enum/workflow-stage.enum';

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
  public locationList: any[] = [];
  public locationDto: any = {};
  public notaryId: number;
  public langArr: number[];
  public languages: Languages;
  public isSinhala: boolean;
  public isTamil: boolean;
  public isEnglish: boolean;
  public languages: any[] = [
    {
      id: Languages.ENGLISH,
      description: "English"
    },
    {
      id: Languages.SINHALA,
      description: "Sinhala"
    },
    {
      id: Languages.TAMIL,
      description: "Tamil"
    }
  ];


  constructor(private judicialService: JudicialService) { }

  ngOnInit() {
    this.judicialChangeForm = new FormGroup({
    });
    this.isSinhala = false;
    this.isTamil = false;
    this.isEnglish = false;
    this.notaryId = 1;
    this.getLandRegistries();
    this.getJudicialZone();
    this.getDsDivision();
    this.getGnDivision();
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

  private getGnDivision(): void {
    this.judicialService.getGnDivision().subscribe(
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
      if (gsDivision.dsDivisionId === this.locationList[index].gsDivision) {
        this.isSelected = false;
      }
    });
    this.locationList.splice(index, 1);
    this.previousSelections.splice(index, 1);
  }

  selectGsDivision(gsDivisionId, index) {
    this.gsDivisions.forEach(gsDivision => {
      if (gsDivision.dsDivisionId === gsDivisionId) {
        this.isSelected = true;
      }
      if (gsDivision.dsDivisionId === this.previousSelections[index]) {
        this.isSelected = false;
      }
    });
    this.previousSelections[index] = gsDivisionId;
  }

  selectGnDivision(gsDivisionId, index) {

  }

  setFiles(files, typeId) {
    this.fileList[typeId] = files;
  }

}
