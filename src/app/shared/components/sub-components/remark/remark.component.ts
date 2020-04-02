import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { RemarkDto } from 'src/app/shared/dto/remark-dto.model';

@Component({
  selector: 'app-remark',
  templateUrl: './remark.component.html',
  styleUrls: ['./remark.component.css']
})
export class RemarkComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  remarkDto: RemarkDto;

  constructor() { }

  ngOnInit() {
  }

}
