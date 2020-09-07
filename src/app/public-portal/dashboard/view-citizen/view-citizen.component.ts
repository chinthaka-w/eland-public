import { SystemService } from './../../../shared/service/system.service';
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
  showSpinner = false;
  isApplyChanges = false;

  constructor(private citizenService: CitizenService,
              private sessionService: SessionService,
              private router: Router,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private systemService: SystemService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userStatus = this.decodeBase64Url(params.get('status'));
      if (this.userStatus === CommonStatus.INACTIVE) {
        this.isEdit = true;
      }
    });
    this.setApplyChanges();
  }

  onApplicationResponse(data: CitizenDTO) {
    this.citizenDTO = data;
    console.log("On main component:   ",this.citizenDTO);
  }

  setApplyChanges(): void {
    this.citizenService.enableChanges.subscribe(
      (result: boolean) => {
        this.isApplyChanges = result;
      }
    );
  }

  onFormSubmit(): void {
    this.showSpinner = true;
    const citizenModel = new CitizenDTO();
    citizenModel.id = this.sessionService.getUser().id;
    citizenModel.workFlowStageCode = WorkflowStageCitizenReg.CITIZEN_MODIFIED;
    this.citizenService.completeAction(citizenModel).subscribe(
      (response: RequestResponse) => {
        if (response.status === CommonStatus.SUCCESS) {
          this.snackBarService.success('Successfully submitted');
          this.router.navigate(['dashboard']);
        }
      },
      () => {
        this.snackBarService.error(this.systemService.getTranslation('ALERT.WARNING.INTERNAL_SERVER_ERROR'));
      },
      () => {
        this.showSpinner = false;
      }
    );
  }

  decodeBase64Url(url: string): string {
    return atob(url);
  }

}
