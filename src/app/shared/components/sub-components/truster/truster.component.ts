import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { TrusterDto } from 'src/app/shared/dto/truster-dto.model';

@Component({
  selector: 'app-truster',
  templateUrl: './truster.component.html',
  styleUrls: ['./truster.component.css']
})
export class TrusterComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  trusterDto: TrusterDto;

  @Input()
  trusterList: TrusterDto[];

  constructor() { }

  ngOnInit() {
  }

}
