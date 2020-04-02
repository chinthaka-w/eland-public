import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FolioService } from '../../service/folio.service';
import { FolioController } from '../../custom-model/folio-controller.model';
import { FolioDto } from '../../dto/folio-dto.model';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { FolioLocation } from 'src/app/shared/dto/folio-location.model';
import { CaveatorDto } from 'src/app/shared/dto/caveator-dto.model';
import { DocumentNatures } from 'src/app/shared/enum/document-nature.enum';
import { ScheduleType } from 'src/app/shared/enum/schedule-type.enum';
import { DocumentType } from 'src/app/shared/enum/document-type.enum';
import { PropertyDto } from '../../dto/property-dto.model';
import { ExtentDto } from '../../dto/extent-dto.model';
import { UnitDto } from '../../dto/unit-dto.model';
import { SnackBarService } from '../../service/snack-bar.service';
import * as _ from 'lodash';
import { ExtentSubCategoryDto } from '../../dto/extent-sub-category-dto.model';
import { SystemService } from '../../service/system.service';
import { BoundaryDto } from '../../dto/boundary-dto.model';
import { BoundarySubCategoryDto } from '../../dto/boundary-sub-category-dto.model';

@Component({
  selector: 'app-folio-view',
  templateUrl: './folio-view.component.html',
  styleUrls: ['./folio-view.component.css']
})
export class FolioViewComponent implements OnInit {

  public showTransaction: boolean = false;
  public selectedTransaction: number = 0;
  public folioDto: FolioDto;
  public uiController = new UiController;
  public folioController = new FolioController;
  public divisionalSecretaries: FolioLocation[];
  public localAuthorities: FolioLocation[];
  public districts: FolioLocation[];
  public provinces: FolioLocation[];
  public landRegistries: FolioLocation[];
  public gramaniladhariDivisions: FolioLocation[];
  public landRegistryDivisions: FolioLocation[];
  public documentType = DocumentType;
  public scheduleType = ScheduleType;
  public propertyDto = new PropertyDto;
  public extentDto = new ExtentDto;
  public unitDto = new UnitDto;
  public caveatorList: CaveatorDto[] = [];
  public saving: boolean = false;
  public documentNature = DocumentNatures;
  public selectedLrDivision;
  public villages: FolioLocation[] = [];
  public selectedLandRegistry: any;
  public invalidFolio: boolean = false;
  public validatingFolio: boolean = false;
  public boundaryDto = new BoundaryDto;
  loading: boolean = true;
  folioNo;

  constructor(
    @Inject(MAT_DIALOG_DATA) folio: string,
    private folioService: FolioService,
    private snackbar: SnackBarService,
    private systemService: SystemService,
    // private dialog: MatDialog
  ) {
    this.folioNo = folio;
  }

  ngOnInit() {
    
    this.loading = true;

    this.folioService.getFolioType(this.folioNo, 'CLERK').subscribe(
      (data) => {
        if (data !== null) {
          if (data['folioTypeId'] === DocumentType.NORMAL_TRUST) this.getNormalTrustFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.EXPRESS_TRUST) this.getExpressTrustFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.GENERAL) this.getGeneralFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.CONDOMINIUM) this.getCondominiumFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.GOV_LANDS) this.getLdoFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.MOVABLE) this.getMovableFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.SPECIAL_CONDOMINIUM_DEEDS) this.getCondominiumFolio(data['folioCode']);
          if (data['folioTypeId'] === DocumentType.SPECIAL_DIVISION_DEEDS) this.getSpecialFolio(data['folioCode']);
        }
        else {
          this.snackbar.warn(this.systemService.getTranslation('ALERT.TITLE.NO_RESULT'));
        }
      },
      error => {
        this.snackbar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
      }
    )


  }

  setConfiguration(folioDto){
    this.folioDto = folioDto;
    this.uiController.isReadOnly = true;
    this.uiController.isFolioHeader = true;
    this.uiController = this.folioService.setUiController(this.uiController, folioDto.folioTypeId);
    this.folioController = this.folioService.setFolioController(this.folioController, folioDto.folioTypeId);
    this.viewTransaction(this.selectedTransaction);
    this.getProvinces();
    if (folioDto.folioGnDivision) this.getVillages(folioDto.folioGnDivision);
    if (folioDto.folioProvince) this.getDistricts(folioDto.folioProvince);
    if (folioDto.folioDistrict) this.getDivisionalSecretaries(folioDto.folioDistrict);
    if (folioDto.folioLandRegistry && folioDto.folioTypeId) this.getDivisionsByFolioType(folioDto.folioLandRegistry, folioDto.folioTypeId);
    if (folioDto.folioDsDivision) this.getGramaniladhariDivision(folioDto.folioDsDivision);
    if (folioDto.folioDistrict) this.getLandRegistries(folioDto.folioDistrict);
    if (folioDto.folioDsDivision) this.getLocalAuthorities(folioDto.folioDsDivision);
  }

  viewTransaction(i) {

    this.selectedTransaction = i;

    this.folioDto.transactions[i].scheduleType == ScheduleType.CLOSE_NOTE ? this.uiController.isCloseNote = true : this.uiController.isCloseNote = false;


    if (this.folioDto.propertyDetail && this.folioDto.folioTypeId != this.documentType.EXPRESS_TRUST) {
      this.propertyDto = this.folioDto.propertyDetail;
    }
    else if (this.folioDto.transactions[i].propertyDetail) {
      this.propertyDto = this.folioDto.transactions[i].propertyDetail;
    }
    else {
      this.propertyDto = new PropertyDto;
      this.folioDto.folioTypeId != this.documentType.NORMAL_TRUST && this.folioDto.folioTypeId != this.documentType.MOVABLE && this.folioDto.folioTypeId != this.documentType.CONDOMINIUM ? this.propertyDto.isLand = 1 : 0;
      this.propertyDto.crossNoteList = [];
    }

    if (this.folioDto.boundary  && this.folioDto.folioTypeId != this.documentType.EXPRESS_TRUST) {
      this.boundaryDto = this.folioDto.boundary;
    }
    else if (this.folioDto.transactions[i].boundary && this.folioDto.folioTypeId == this.documentType.EXPRESS_TRUST) {
      this.boundaryDto = this.folioDto.transactions[i].boundary;
    }
    else {
      this.boundaryDto = new BoundaryDto;
      this.boundaryDto.boundaryType = 1;
      this.boundaryDto.boundaryList = new BoundarySubCategoryDto;
      this.boundaryDto.optionalList = [];
    }

    if (this.folioDto.extent && this.folioDto.folioTypeId != this.documentType.EXPRESS_TRUST) {
      this.extentDto = this.folioDto.extent;
    }
    else if (this.folioDto.transactions[i].extent && this.folioDto.folioTypeId == this.documentType.EXPRESS_TRUST) {
      this.extentDto = this.folioDto.transactions[i].extent;
    }
    else {
      this.extentDto = new ExtentDto;
      this.extentDto.extentType = "1";
      this.extentDto.extentList = new ExtentSubCategoryDto;
    }

    if (this.folioDto) {
      this.unitDto = this.folioDto as unknown as UnitDto;
    }
    else {
      this.unitDto = new UnitDto;
    }

    if (this.folioDto.units || this.folioDto.units != null) {
      // this.unitDto.unitList = this.folioDto.units;
    }
    else {
      this.unitDto.unitList = [];
    }

    this.folioDto.documentNatureId = this.folioDto.transactions[i].documentNatureId;
  }



  getNormalTrustFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getExpressTrustFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getGeneralFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getCondominiumFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getMovableFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getLdoFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  getSpecialFolio(folioNo) {
    this.folioService.getExpressTrustFolio(btoa(folioNo)).subscribe(
      (folio: FolioDto) => {
        this.loading = false;
        // this.dialog.open(FolioViewComponent, { width: '90%', height: '90%', data: folio });
        this.setConfiguration(folio);
      },
      (error) => {
        this.loading = false;
        this.snackbar.error('Internal server error');
      }
    )
  }

  toggleTransactionView() {
    this.showTransaction = !this.showTransaction;
  }

  selectTransaction(index) {
    this.selectedTransaction = index;
  }

  getVillages(gnDivision) {
    this.folioService.getVillages(gnDivision).subscribe(
      (data: FolioLocation[]) => {
        this.villages = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getProvinces() {
    this.folioService.getProvinces().subscribe(
      (data: FolioLocation[]) => {
        this.provinces = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getDistricts(provinceCode) {
    this.folioService.getDistricts(provinceCode).subscribe(
      (data: FolioLocation[]) => {
        this.districts = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getLandRegistries(districtCode) {
    this.folioService.getLandRegistries(districtCode).subscribe(
      (data: FolioLocation[]) => {
        this.landRegistries = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getGramaniladhariDivision(dsDivisionId) {
    this.folioService.getGramaniladhariDivision(dsDivisionId).subscribe(
      (data: any[]) => {
        this.gramaniladhariDivisions = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getDivisionalSecretaries(districtCode) {
    this.folioService.getDivisionalSecretaries(districtCode).subscribe(
      (data: FolioLocation[]) => {
        this.divisionalSecretaries = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getLocalAuthorities(dsDivision) {
    this.folioService.getLocalAuthorities(dsDivision).subscribe(
      (data: FolioLocation[]) => {
        this.localAuthorities = data;
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

  getDivisionsByFolioType(landRegistry, folioType) {
    this.folioService.getDivisionsByFolioType(landRegistry, folioType).subscribe(
      (data: FolioLocation[]) => {
        this.landRegistryDivisions = data;
        this.selectedLrDivision = _.find(this.landRegistryDivisions, { landRegistryDivisionId: this.folioDto.folioLrDivision });
      },
      error => {
        this.snackbar.error('Internal server error');
      }
    )
  }

}
