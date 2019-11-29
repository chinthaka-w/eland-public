import {Component, OnInit} from '@angular/core';
import {Workflow} from '../../shared/enum/workflow.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // userType = 'notary';
  userType = 'public';

  Workflow = Workflow;

  constructor() {
  }

  ngOnInit() {
  }

  getBase64(value: string): string {
    return btoa(value);
  }

}
