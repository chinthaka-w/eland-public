import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { BeneficiaryDto } from 'src/app/shared/dto/beneficiary-dto.model';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css']
})
export class BeneficiaryComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  beneficiaryDto: BeneficiaryDto;

  @Input()
  beneficiaryList: BeneficiaryDto[];

  constructor() { }

  ngOnInit() {
  }

}
