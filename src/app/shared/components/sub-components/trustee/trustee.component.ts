import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { TrusteeDto } from 'src/app/shared/dto/trustee-dto.model';

@Component({
  selector: 'app-trustee',
  templateUrl: './trustee.component.html',
  styleUrls: ['./trustee.component.css']
})
export class TrusteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  trusteeDto: TrusteeDto;

  @Input()
  trusteeList: TrusteeDto[];

  constructor() { }

  ngOnInit() {
  }

}
