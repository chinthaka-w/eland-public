import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { PropertyDto } from 'src/app/shared/dto/property-dto.model';
import { FolioLocation } from 'src/app/shared/dto/folio-location.model';
import { PropertyController } from 'src/app/shared/dto/property-controller.model';
import * as moment from 'moment';
import { FolioService } from 'src/app/shared/service/folio.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { SystemService } from 'src/app/shared/service/system.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  propertyDto: PropertyDto;

  model: any;
  searching = false;
  searchFailed = false;
  planDate: any;
  grantDate: any;
  surveyPlanDate: any;
  partitionedDate: any;
  surveyedAndPartitionedDate: any;

  @Input()
  folioDto;

  @Input()
  villages;

  public pattus: FolioLocation[] = [];
  public korales: FolioLocation[] = [];
  // public villages: FolioLocation[] = [];
  private crossNote: any = {};
  public documentType = DocumentType;
  public documentTypeId: number;
  public propertyController = new PropertyController;

  defaultFromDate = moment().add(-1, 'day');
  defaultToDate = moment();
  today = { year: +this.defaultToDate.format("YYYY"), month: +this.defaultToDate.format("MM"), day: +this.defaultToDate.format("DD") };


  constructor(
    private folioService: FolioService,
    private snackBar: SnackBarService,
    private systemService: SystemService
  ) { }

  ngOnInit() {

    if (this.folioDto && this.folioDto.folioTypeId) {
      this.documentTypeId = this.folioDto.folioTypeId;
    }

    this.getKorales();
    if (this.propertyDto.korale) {
      this.getPaththus(this.propertyDto.korale);
    }

    this.propertyController = this.folioService.setPropertyController(this.propertyController, this.documentTypeId);


    if (this.propertyDto.planDate) {
      var planDate = moment(this.propertyDto.planDate);
      this.planDate = { year: +planDate.format("YYYY"), month: +planDate.format("MM"), day: +planDate.format("DD") };
    }

    if (this.propertyDto.grantDate) {
      var grantDate = moment(this.propertyDto.grantDate);
      this.grantDate = { year: +grantDate.format("YYYY"), month: +grantDate.format("MM"), day: +grantDate.format("DD") };
    }

    if (this.propertyDto.surveyPlanDate) {
      var surveyPlanDate = moment(this.propertyDto.surveyPlanDate);
      this.surveyPlanDate = { year: +surveyPlanDate.format("YYYY"), month: +surveyPlanDate.format("MM"), day: +surveyPlanDate.format("DD") };
    }

    if (this.propertyDto.partitionedDate) {
      var partitionedDate = moment(this.propertyDto.partitionedDate);
      this.partitionedDate = { year: +partitionedDate.format("YYYY"), month: +partitionedDate.format("MM"), day: +partitionedDate.format("DD") };
    }

    if (this.propertyDto.surveyedAndPartitionedDate) {
      var surveyedAndPartitionedDate = moment(this.propertyDto.surveyedAndPartitionedDate);
      this.surveyedAndPartitionedDate = { year: +surveyedAndPartitionedDate.format("YYYY"), month: +surveyedAndPartitionedDate.format("MM"), day: +surveyedAndPartitionedDate.format("DD") };
    }
  }

  selectVillage(event) {
    event.preventDefault();
    this.propertyDto.village = event.item;
    this.model = event.item;
  }

  isLand(event) {
    if (event.target.value == 'yes') { this.propertyDto.isLand = 1; }
    else if (event.target.value == 'no') this.propertyDto.isLand = 0;
  }

  getPaththus(koraleId) {
    this.folioService.getPaththus(koraleId).subscribe(
      (data: FolioLocation[]) => {
        this.pattus = data;
      },
      error => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
      }
    )
  }

  getVillages(pattuId) {
    this.folioService.getVillages(pattuId).subscribe(
      (data: FolioLocation[]) => {
        this.villages = data;
      },
      error => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
      }
    )
  }

  getKorales() {
    this.folioService.getKorales().subscribe(
      (data: FolioLocation[]) => {
        this.korales = data;
      },
      error => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
      }
    )
  }

  addCrossNote() {
    this.propertyDto.crossNoteList.push(this.crossNote)
    this.crossNote = {};
  }

  deleteCrossNote(index) {
    this.propertyDto.crossNoteList.splice(index, 1);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  onDateChange(date) {
    if (date == 'planDate') this.propertyDto.planDate = `${this.planDate.year}-${this.planDate.month}-${this.planDate.day}`;
    if (date == 'grantDate') this.propertyDto.grantDate = `${this.grantDate.year}-${this.grantDate.month}-${this.grantDate.day}`;
    if (date == 'surveyedAndPartitionedDate') this.propertyDto.surveyedAndPartitionedDate = `${this.surveyedAndPartitionedDate.year}-${this.surveyedAndPartitionedDate.month}-${this.surveyedAndPartitionedDate.day}`;
    if (date == 'partitionedDate') this.propertyDto.partitionedDate = `${this.partitionedDate.year}-${this.partitionedDate.month}-${this.partitionedDate.day}`;
    if (date == 'surveyPlanDate') this.propertyDto.surveyPlanDate = `${this.surveyPlanDate.year}-${this.surveyPlanDate.month}-${this.surveyPlanDate.day}`;
  }

  getVillagesByGn(gnDivision) {
    this.folioService.getVillages(gnDivision).subscribe(
      (data: FolioLocation[]) => {
        this.villages = data;
      },
      error => {
        this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
      }
    )
  }

}
