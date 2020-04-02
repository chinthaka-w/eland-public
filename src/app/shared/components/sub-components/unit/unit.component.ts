import { Component, OnInit, Input } from '@angular/core';
import { UnitDto } from 'src/app/shared/dto/unit-dto.model';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  @Input()
  unitDto: UnitDto;

  @Input()
  uiController: UiController;

  constructor() { }

  ngOnInit() {
  }

}
