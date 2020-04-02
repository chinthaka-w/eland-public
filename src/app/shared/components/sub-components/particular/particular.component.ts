import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { ParticularDto } from 'src/app/shared/dto/particular-dto';

@Component({
  selector: 'app-particular',
  templateUrl: './particular.component.html',
  styleUrls: ['./particular.component.css']
})
export class ParticularComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  particularDto: ParticularDto;

  constructor() { }

  ngOnInit() {
  }

}
