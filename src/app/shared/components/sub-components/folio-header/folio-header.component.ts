import { Component, OnInit, Input } from '@angular/core';
import { FolioDto } from 'src/app/shared/dto/folio-dto.model';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { FolioController } from 'src/app/shared/custom-model/folio-controller.model';
import { FolioLocation } from 'src/app/shared/dto/folio-location.model';

@Component({
  selector: 'app-folio-header',
  templateUrl: './folio-header.component.html',
  styleUrls: ['./folio-header.component.css']
})
export class FolioHeaderComponent implements OnInit {

  @Input()
  folioDto: FolioDto;

  @Input()
  uiController: UiController;

  @Input()
  folioController: FolioController;

  @Input()
  divisionalSecretaries: FolioLocation;

  @Input()
  gramaniladhariDivisions: UiController;

  @Input()
  landRegistryDivisions: UiController;

  @Input()
  localAuthorities: UiController;

  @Input()
  districts: UiController;

  @Input()
  provinces: UiController;

  @Input()
  landRegistries: UiController;

  constructor() { }

  ngOnInit() {
  }

}
