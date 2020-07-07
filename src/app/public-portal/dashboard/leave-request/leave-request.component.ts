import { CommonStatus } from 'src/app/shared/enum/common-status.enum';
import { RequestResponse } from './../../../shared/dto/request-response.model';
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NotaryLeaveRequestDTO} from '../../../shared/dto/notary-leave-request-dto';
import {NotaryLeaveRequestService} from '../../../shared/service/notary-leave-request.service';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {NotaryLeaveReqWorkflowStage} from '../../../shared/enum/notary-leave-req-workflow-stage.enum';
import {WorkflowStageDocTypeDTO} from '../../../shared/dto/workflow-stage-doc-type-dto';
import {Location, DatePipe} from '@angular/common';
import {SystemService} from '../../../shared/service/system.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {

  notaryLeaveRequestForm: FormGroup;
  fileList = {};
  leaveRequest: NotaryLeaveRequestDTO = new NotaryLeaveRequestDTO();
  notaryId: number;
  notaryLeaveReqWorkflowStage = NotaryLeaveReqWorkflowStage;
  workflowStageDocTypes: Array<WorkflowStageDocTypeDTO> = [];
  minDate = undefined;
  thisvalid: boolean;
  isDuplicateLeavePeriod = false;
  isInvalidTimePeriod = false;

  constructor(private route: ActivatedRoute,
              private notaryLeaveRequestService: NotaryLeaveRequestService,
              private snackBar: SnackBarService,
              private router: Router,
              private location: Location,
              private systemService: SystemService,
              private datePipe: DatePipe) {

    // const current =
    this.minDate = new Date();

  }

  ngOnInit() {

    this.notaryLeaveRequestForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
      recaptcha: new FormControl('', [Validators.required])
    });
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.notaryId = param.id;
      }
    });
    this.notaryLeaveRequestService.getRelatedDocTypes(this.notaryLeaveReqWorkflowStage.LEAVE_REQ_INIT)
      .subscribe((result) => {
        if (result) {
          this.workflowStageDocTypes = result;
        }
      });

  }

  get FormControls() {
    return this.notaryLeaveRequestForm.controls;
  }

//   getTimeDifferent(): boolean {
    
// }

  makeLeaveRequest() {
    console.log('time to: ', this.datePipe.transform(this.notaryLeaveRequestForm.value.toDate, 'yyyy-MM-dd'));
    const difftime = this.notaryLeaveRequestForm.value.toDate - this.notaryLeaveRequestForm.value.fromDate;
    if (difftime >= 0) {

      const leaveRequest = new NotaryLeaveRequestDTO();
      leaveRequest.fromDate = this.convertDateToString(this.notaryLeaveRequestForm.value.fromDate);
      leaveRequest.toDate = this.convertDateToString(this.notaryLeaveRequestForm.value.toDate);
      this.notaryLeaveRequestService.validateLeaveRange(leaveRequest).subscribe(
        (response: RequestResponse) => {
          if (response.status === CommonStatus.SUCCESS &&
            response.data) {
            this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.DUP_TIME_RANGE'));
          } else if (response.status === CommonStatus.SUCCESS && !(response.data)) {

            // submit leave request
            this.leaveRequest = this.notaryLeaveRequestForm.value;
            this.leaveRequest.fromDate = leaveRequest.fromDate;
            this.leaveRequest.toDate = leaveRequest.toDate;
            this.leaveRequest.notaryId = this.notaryId;
            this.leaveRequest.workflowStageCode = this.notaryLeaveReqWorkflowStage.LEAVE_REQ_INIT;
            this.notaryLeaveRequestService.makeLeaveRequest(this.fileList, this.leaveRequest)
              .subscribe((result) => {
                if (result) {
                  this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
                  this.router.navigate(['/dashboard']);
                } else {
                  this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.OPERATION_FAILED'));
                }
              });
          }
        },
        () => {
          this.snackBar.error(this.systemService.getTranslation('ALERT.TITLE.SERVER_ERROR'));
        }
      );
    } else {
      this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.INV_DATE'));
    }


    // if (this.getTimeDifferent()) {
      
    // } else {
    //   console.log('time: ', this.isInvalidTimePeriod, 'duplicate: ', this.isDuplicateLeavePeriod);
    //   if (this.isInvalidTimePeriod) {
    //     this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.INV_DATE'));
    //   } else if (this.isDuplicateLeavePeriod) {
    //     this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.DUP_TIME_RANGE'));
    //   }
    // }
  }
  setFiles(files, key) {
    this.fileList[key] = files;
  }

  goBack(): any {
    this.location.back();
    return false;
  }

  convertDateToString(rawValue: string): string {
    return this.datePipe.transform(rawValue, 'yyyy-MM-dd');
  }
}
