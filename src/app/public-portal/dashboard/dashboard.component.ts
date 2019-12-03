import {Component, OnInit} from '@angular/core';
import {Workflow} from '../../shared/enum/workflow.enum';
import { SessionService } from 'src/app/shared/service/session.service';
import { UserType } from 'src/app/shared/enum/user-type.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user;
  userType = UserType;

  Workflow = Workflow;

  constructor(
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.user = this.sessionService.getUser();
  }

  getBase64(value: string): string {
    return btoa(value);
  }

}
