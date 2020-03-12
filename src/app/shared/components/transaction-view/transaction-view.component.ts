import { Component, OnInit, Input } from '@angular/core';
import { UiController } from '../../custom-model/ui-controller.model';

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.css']
})


export class TransactionViewComponent implements OnInit {

  @Input()
  uiController: UiController;

  constructor() { }

  ngOnInit() {
  }

}
