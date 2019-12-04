import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-extract-view',
  templateUrl: './extract-view.component.html',
  styleUrls: ['./extract-view.component.css']
})
export class ExtractViewComponent implements OnInit {

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
