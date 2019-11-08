import { Component, OnInit } from '@angular/core';
import {LandRegistryModel} from '../../../shared/custom-model/land-registry.model';
import {JudicialService} from './change-judicial-service';
import {JudicialZoneModel} from '../../../shared/custom-model/judicial-zone.model';

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
