import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { CoTrusteeDto } from 'src/app/shared/dto/co-trustee-dto.model';

@Component({
  selector: 'app-co-trustee',
  templateUrl: './co-trustee.component.html',
  styleUrls: ['./co-trustee.component.css']
})
export class CoTrusteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  coTrusteeDto: CoTrusteeDto;

  @Input()
  coTrusteeList: CoTrusteeDto[];

  constructor() { }

  ngOnInit() {
  }

}
