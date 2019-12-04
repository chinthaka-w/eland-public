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

  public Workflow: string;

  constructor(private location: Location,
              private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.flag = atob(params['flag']); // (+) converts string 'id' to a number
    });
  }

  ngOnInit() {
  }


  goBack(): any {
    this.location.back();
    return false;
  }

}
