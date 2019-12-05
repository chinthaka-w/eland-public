import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {ActivatedRoute} from '@angular/router';
import {ActionMode} from '../../../../shared/enum/action-mode.enum';
import {SearchRequestWorkflowStages} from '../../../../shared/enum/search-request-workflow-stages.enum';

@Component({
  selector: 'app-search-document-view',
  templateUrl: './search-document-view.component.html',
  styleUrls: ['./search-document-view.component.css']
})
export class SearchDocumentViewComponent implements OnInit {

  public workflow: string = Workflow.SEARCH_REQUEST;
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
    this.action = this.workflowStage == SearchRequestWorkflowStages.SEARCH_REQ_INITIALIZED ? ActionMode.VIEW : ActionMode.UPDATE;
  }


  goBack(): any {
    this.location.back();
    return false;
  }

}
