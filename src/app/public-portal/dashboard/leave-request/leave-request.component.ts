import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NotaryLeaveRequestDTO} from '../../../shared/dto/notary-leave-request-dto';
import {NotaryLeaveRequestService} from '../../../shared/service/notary-leave-request.service';
import {SnackBarService} from '../../../shared/service/snack-bar.service';
import {NotaryLeaveReqWorkflowStage} from '../../../shared/enum/notary-leave-req-workflow-stage.enum';
import {WorkflowStageDocTypeDTO} from '../../../shared/dto/workflow-stage-doc-type-dto';
import {Location} from '@angular/common';

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

  constructor(private route: ActivatedRoute,
              private notaryLeaveRequestService: NotaryLeaveRequestService,
              private snackBar: SnackBarService,
              private router: Router,
              private location: Location) {

    // const current =
    this.minDate = new Date();

  }

  ngOnInit() {

    this.notaryLeaveRequestForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
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

  getTimeDifferent(): boolean {
    const difftime = this.notaryLeaveRequestForm.value.toDate - this.notaryLeaveRequestForm.value.fromDate;

    if (difftime > 0) {
          return true;
    } else {
      return false;
    }
}

  makeLeaveRequest() {
    if (this.getTimeDifferent()) {
      this.leaveRequest = this.notaryLeaveRequestForm.value;
      this.leaveRequest.notaryId = this.notaryId;
      this.leaveRequest.workflowStageCode = this.notaryLeaveReqWorkflowStage.LEAVE_REQ_INIT;
      this.notaryLeaveRequestService.makeLeaveRequest(this.fileList, this.leaveRequest)
        .subscribe((result) => {
          if (result) {
            this.snackBar.success('Request added successfully');
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.error('Operation failed');
          }
        });
    } else {
      this.snackBar.error('Invalid Date Range');
    }
  }
  setFiles(files, key) {
    this.fileList[key] = files;
  }

  goBack(): any {
    this.location.back();
    return false;
  }
}
