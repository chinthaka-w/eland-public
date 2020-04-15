import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkflowStageCitizenReg } from './../../../shared/enum/workflow-stage-citizen-reg.enum';
import { RequestResponse } from './../../../shared/dto/request-response.model';
import { CommonStatus } from './../../../shared/enum/common-status.enum';
import { SessionService } from './../../../shared/service/session.service';
import { Component, OnInit } from '@angular/core';
import {CitizenService} from "../../../shared/service/citizen.service";
import {CitizenDTO} from "../../../shared/dto/citizen-dto";

@Component({
  selector: 'app-view-citizen',
  templateUrl: './view-citizen.component.html',
  styleUrls: ['./view-citizen.component.css']
})
export class ViewCitizenComponent implements OnInit {
  citizenDTO: CitizenDTO = new CitizenDTO();
  userStatus: string;
  commonStatus = CommonStatus;
  isEdit = false;

  constructor(private citizenService: CitizenService,
              private sessionService: SessionService,
              private router: Router,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userStatus = this.decodeBase64Url(params.get('status'));
      if (this.userStatus === CommonStatus.INACTIVE) {
        this.isEdit = true;
      }
    });
  }

  onApplicationResponse(data: CitizenDTO) {
    this.citizenDTO = data;
    console.log("On main component:   ",this.citizenDTO);
  }

  onFormSubmit(): void  {
    const citizenModel = new CitizenDTO();
    citizenModel.id = this.sessionService.getUser().id;
    citizenModel.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_MODIFIED;
    this.citizenService.completeAction(citizenModel).subscribe(
      (response: RequestResponse) => {
        if (response.status === CommonStatus.SUCCESS) {
          this.snackBarService.success('Successfully submitted');
          this.router.navigate(['dashboard']);
        } else {
          this.snackBarService.error('Error in submission');
        }
      }
    );
  }

  decodeBase64Url(url: string): string {
    return atob(url);
  }

}
