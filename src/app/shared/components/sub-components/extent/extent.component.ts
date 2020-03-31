import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { ExtentDto } from 'src/app/shared/dto/extent-dto.model';
import { ExtentType } from 'src/app/shared/enum/extent-type.enum';

@Component({
  selector: 'app-extent',
  templateUrl: './extent.component.html',
  styleUrls: ['./extent.component.css']
})
export class ExtentComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  extentDto: ExtentDto;

  public extentType = ExtentType;

  constructor() { }

  ngOnInit() {
  }

}
