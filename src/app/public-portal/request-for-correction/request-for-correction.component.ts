import { ActivatedRoute } from '@angular/router';
import { Workflow } from './../../shared/enum/workflow.enum';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-request-for-correction',
  templateUrl: './request-for-correction.component.html',
  styleUrls: ['./request-for-correction.component.css']
})
export class RequestForCorrectionComponent implements OnInit {

  workflow = Workflow;
  isReadOnly = false;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') != null) {
        this.isReadOnly = true;
      }
    });
  }

  getBase64(url: string): string {
    return btoa(url);
  }

}
