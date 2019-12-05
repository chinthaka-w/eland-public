import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ActionMode} from '../../../../shared/enum/action-mode.enum';
import {SearchRequestWorkflowStages} from '../../../../shared/enum/search-request-workflow-stages.enum';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {ExtractRequestWorkflowStages} from '../../../../shared/enum/extract-request-workflow-stages.enum';

@Component({
  selector: 'app-extract-view',
  templateUrl: './extract-view.component.html',
  styleUrls: ['./extract-view.component.css']
})
export class ExtractViewComponent implements OnInit {

  public workflow: string = Workflow.EXTRACT_REQUEST;
  public workflowStage: any;
  public requestId: any;
  public action: any;

  ActionMode = ActionMode;

  constructor(private location: Location,
              private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.workflowStage = atob(params['workflow']);
      this.requestId = atob(params['id']);
    });
  }

  ngOnInit() {
    this.action = this.workflowStage == ExtractRequestWorkflowStages.EXTRACT_REQ_INITIALIZED ? ActionMode.VIEW : ActionMode.UPDATE;
  }

  goBack(): any {
    this.location.back();
    return false;
  }

}
