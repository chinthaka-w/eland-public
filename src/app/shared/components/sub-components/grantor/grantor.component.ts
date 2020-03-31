import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { GrantorDto } from 'src/app/shared/dto/grantor-dto.model';

@Component({
  selector: 'app-grantor',
  templateUrl: './grantor.component.html',
  styleUrls: ['./grantor.component.css']
})
export class GrantorComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  grantorDto: GrantorDto;

  @Input()
  grantorList: GrantorDto[];

  constructor() { }

  ngOnInit() {
  }

}
