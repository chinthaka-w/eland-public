import { Workflow } from './../../../shared/enum/workflow.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-for-correction-view',
  templateUrl: './request-for-correction-view.component.html',
  styleUrls: ['./request-for-correction-view.component.css']
})
export class RequestForCorrectionViewComponent implements OnInit {
  workflow = Workflow;

  constructor() { }

  ngOnInit() {
  }

  getBase64Url(url: string): string {
    return btoa(url);
  }

}
