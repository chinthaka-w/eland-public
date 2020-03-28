import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { BeneficialDto } from 'src/app/shared/dto/beneficial-dto.model';

@Component({
  selector: 'app-beneficial',
  templateUrl: './beneficial.component.html',
  styleUrls: ['./beneficial.component.css']
})
export class BeneficialComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  beneficialDto: BeneficialDto;

  @Input()
  beneficialList: BeneficialDto[];

  constructor() { }

  ngOnInit() {
  }

}
