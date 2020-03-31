import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { BoundaryDto } from 'src/app/shared/dto/boundary-dto.model';

@Component({
  selector: 'app-boundary',
  templateUrl: './boundary.component.html',
  styleUrls: ['./boundary.component.css']
})
export class BoundaryComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  boundaryDto: BoundaryDto;

  constructor() { }

  ngOnInit() {
  }

}
