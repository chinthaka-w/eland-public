import { Component, OnInit } from '@angular/core';
import {WorkflowStages} from "../../../../shared/enum/workflow-stages.enum";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-name-change-request-view',
  templateUrl: './name-change-request-view.component.html',
  styleUrls: ['./name-change-request-view.component.css']
})
export class NameChangeRequestViewComponent implements OnInit {
  requestId: string;
  WorkflowCode = WorkflowStages;
  id: number;
  workflow: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.workflow  = atob(params['workflow']);
      this.requestId  = atob(params['id']);
      this.id = +this.requestId;
    });

  }


  ngOnInit() {
  }

}
