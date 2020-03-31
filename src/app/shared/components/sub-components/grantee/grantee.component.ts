import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { GranteeDto } from 'src/app/shared/dto/grantee-dto.model';

@Component({
  selector: 'app-grantee',
  templateUrl: './grantee.component.html',
  styleUrls: ['./grantee.component.css']
})
export class GranteeComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  granteeDto: GranteeDto;

  @Input()
  granteeList: GranteeDto[];

  constructor() { }

  ngOnInit() {
  }

}
