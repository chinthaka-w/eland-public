import { Component, OnInit } from '@angular/core';
import {Workflow} from '../../../shared/enum/workflow.enum';

@Component({
  selector: 'app-view-notary',
  templateUrl: './view-notary.component.html',
  styleUrls: ['./view-notary.component.css']
})
export class ViewNotaryComponent implements OnInit {
  Workflow: Workflow;
  public workflow: string = Workflow.NOTARY_REGISTRATION;
  public id: number = 1;

  constructor() { }

  ngOnInit() {
  }

}
