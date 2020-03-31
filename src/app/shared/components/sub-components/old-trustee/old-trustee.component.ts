import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { OldTrusteeDto } from 'src/app/shared/dto/old-trustee-dto.model';

@Component({
  selector: 'app-old-trustee',
  templateUrl: './old-trustee.component.html',
  styleUrls: ['./old-trustee.component.css']
})
export class OldTrusteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  oldTrusteeDto: OldTrusteeDto;

  @Input()
  oldTrusteeList: OldTrusteeDto[];

  constructor() { }

  ngOnInit() {
  }

}
