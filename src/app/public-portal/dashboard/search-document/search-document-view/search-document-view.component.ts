import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Workflow} from '../../../../shared/enum/workflow.enum';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search-document-view',
  templateUrl: './search-document-view.component.html',
  styleUrls: ['./search-document-view.component.css']
})
export class SearchDocumentViewComponent implements OnInit {

  public workflow: string;
  public requestId: any;

  constructor(private location: Location,
              private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.workflow = atob(params['workflow']);
      this.requestId = atob(params['id']);
    });
  }

  ngOnInit() {
  }


  goBack(): any {
    this.location.back();
    return false;
  }

}
