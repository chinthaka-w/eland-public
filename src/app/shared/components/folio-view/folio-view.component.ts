import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UiController } from '../../custom-model/ui-controller.model';
import { FolioService } from '../../service/folio.service';
import { FolioController } from '../../custom-model/folio-controller.model';

@Component({
  selector: 'app-folio-view',
  templateUrl: './folio-view.component.html',
  styleUrls: ['./folio-view.component.css']
})
export class FolioViewComponent implements OnInit {

  showTransaction: boolean = false;
  selectedTransaction: number = 0;
  folioDto;
  uiController = new UiController;
  folioController = new FolioController;

  constructor(
    @Inject(MAT_DIALOG_DATA) folio,
    private folioService: FolioService
  ) {
    
    this.folioDto = folio;
   }

  ngOnInit() {
    this.uiController.isReadOnly = true;
    this.uiController.isFolioHeader = true;
    this.uiController = this.folioService.setUiController(this.uiController,this.folioDto.folioTypeId);
    // if(this.expressTrustRequestCustomModel && this.expressTrustRequestCustomModel.registrationTypeCode == DocumentCategory.CAVEAT){
    //   this.uiController.isCaveator = true;
    //   this.caveatService.getCaveat(`${this.folioDto.folioLandRegistry}/${this.folioDto.folioCode}`).subscribe(
    //     (caveators: any[]) => {
    //       this.caveatorList = caveators;
    //     },
    //   )
    // }
    this.folioController = this.folioService.setFolioController(this.folioController, this.folioDto.folioTypeId);
    // this.viewTransaction(this.selectedTransaction);
    // this.getProvinces();
    // if(this.folioDto.folioGnDivision) this.getVillages(this.folioDto.folioGnDivision);
    // if(this.folioDto.folioProvince) this.getDistricts(this.folioDto.folioProvince);
    // if(this.folioDto.folioDistrict) this.getDivisionalSecretaries(this.folioDto.folioDistrict);
    // if(this.folioDto.folioLandRegistry && this.folioDto.folioTypeId) this.getDivisionsByFolioType(this.folioDto.folioLandRegistry, this.folioDto.folioTypeId);
    // if(this.folioDto.folioDsDivision) this.getGramaniladhariDivision(this.folioDto.folioDsDivision);
    // if(this.folioDto.folioDistrict) this.getLandRegistries(this.folioDto.folioDistrict);
    // if(this.folioDto.folioDsDivision) this.getLocalAuthorities(this.folioDto.folioDsDivision);
  }

  toggleTransactionView(){
    this.showTransaction = !this.showTransaction
  }

  selectTransaction(index){
    this.selectedTransaction= index;
  }

}
