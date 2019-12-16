import {Component, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {JudicialChange} from '../../../../../shared/dto/judicial-change-model';
import {JudicialService} from '../../../../../shared/service/change-judicial-service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
  public judicialChange: JudicialChange;
  requestForm: FormGroup;
  public gsDivisions: DsDivision[];
  public gnDivisions: GnDivisionDTO[];
  public landRegistry: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];
  public locationList: any[] = [];
  public previousSelections: any[] = [];
  public locationDto: any = {};
  public judicialChangeDto = new JudicialChange;
  public notaryId: number = 1;
  public langArr: number[];
  public isSinhala: boolean;
  public isTamil: boolean;
  public isEnglish: boolean;
  public dsGnList: DsGnDivisionDTO[] = [];
  public dsGnDivisions: NewNotaryDsDivisionDTO[] = [];
  public dsDivisionId: number;
  public isSelected: boolean;
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

  constructor(private judicialZoneService: JudicialService, private judicialService: JudicialService, private snackBar: SnackBarService) { }

  ngOnInit() {
    this.requestForm = new FormGroup({
      addressEng: new FormControl(""),
      addressSin: new FormControl(""),
      addressTam: new FormControl(""),
      notarialWorkStartDate: new FormControl(""),
      certificateYear: new FormControl(""),
      nameOfLr: new FormControl(""),
      isDuplicateHandedOver: new FormControl(""),
      fromDate: new FormControl("", [Validators.required]),
      toDate: new FormControl("", [Validators.required]),
      judicialZoneId: new FormControl("", [Validators.required]),
      landRegistry: new FormControl("", [Validators.required]),

    });
    this.locationList.push(this.locationDto);
    this.getLandRegistries();
    this.getJudicialZone();
    this.getDsDivision();
    this.getJudicialChangeDetails(this.id);
    this.getLanguages();
    this.isSelected = false;
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

  private getJudicialChangeDetails(id): void {
    this.judicialZoneService.getRequestData(id).subscribe(
      (data: JudicialChange) => {
        this.judicialChange = data;
        this.requestForm.patchValue(
          {
            addressEng: this.judicialChange.addressEng,
            addressSin: this.judicialChange.addressSin,
            addressTam: this.judicialChange.addressTam,
            notarialWorkStartDate: this.judicialChange.notarialWorkStartDate,
            certificateYear: this.judicialChange.certificateYear,
            nameOfLr: this.judicialChange.nameOfLr,
            isDuplicateHandedOver: this.judicialChange.isDuplicateHandedOver,
            fromDate: this.judicialChange.fromDate,
            toDate: this.judicialChange.toDate,
            judicialZoneId: this.judicialChange.judicialZoneId,
            landRegistry: this.judicialChange.landRegistry,
          }
        );
        this.dsGnDivisions = this.judicialChange.newNotaryDsDivisionDTO;
      }
    );
  }

  submitForm() {
    this.judicialChangeDto = this.requestForm.value;
    this.judicialChangeDto.newNotaryId = this.notaryId;
    this.judicialChangeDto.dsGnList = this.dsGnList;
    this.judicialChangeDto.requestId = this.id;

    this.judicialService.update(this.judicialChangeDto).subscribe(
      (success: string) => {
        this.snackBar.success('Judicial Change Request Success');
        this.requestForm.reset();
      },
      error => {
        this.snackBar.error('Failed');
      }
    );
  }

  selectGsDivision(gsDivisionId, index) {
    this.dsDivisionId = gsDivisionId;
    this.getGnDivision(gsDivisionId);
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

  selectGnDivision(gsDivisionId) {
    this.dsGnList.push(new DsGnDivisionDTO(gsDivisionId[0], this.dsDivisionId));
  }



}
