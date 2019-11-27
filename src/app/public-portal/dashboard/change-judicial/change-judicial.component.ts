import { Component, OnInit } from '@angular/core';

import {JudicialService} from './change-judicial-service';
import {JudicialZoneModel} from '../../../shared/dto/judicial-zone.model';
import {LandRegistryModel} from "../../../shared/dto/land-registry.model.";

@Component({
  selector: 'app-change-judicial',
  templateUrl: './change-judicial.component.html',
  styleUrls: ['./change-judicial.component.css']
})
export class ChangeJudicialComponent implements OnInit {
  public landRegistry: LandRegistryModel[];
  public judicialZone: JudicialZoneModel[];

  constructor(private judicialService: JudicialService) { }

  ngOnInit() {
    this.getLandRegistries();
    this.getJudicialZone();
  }

  private getLandRegistries(): void {
    this.judicialService.getAllLandRegistries().subscribe(
      (data: LandRegistryModel[]) => {
        this.landRegistry = data;
      }
    )
  }

  private getJudicialZone(): void {
    this.judicialService.getAllJudicialZone().subscribe(
      (data: JudicialZoneModel[]) => {
        this.judicialZone = data;
      }
    )
  }

}
