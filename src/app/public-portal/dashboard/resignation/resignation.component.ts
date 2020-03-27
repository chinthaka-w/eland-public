import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NotaryResignationDto} from "../../../shared/dto/notary-resignation-dto";
import {NotaryResignationService} from "../../../shared/service/notary-resignation.service";
import {WorkflowStageNotaryResignation} from "../../../shared/enum/workflow-stage-notary-resignation.enum";
import {WorkflowStageDocTypeDTO} from "../../../shared/dto/workflow-stage-doc-type-dto";
import {SnackBarService} from "../../../shared/service/snack-bar.service";

@Component({
  selector: 'app-resignation',
  templateUrl: './resignation.component.html',
  styleUrls: ['./resignation.component.css']
})
export class ResignationComponent implements OnInit {
  fileList = {};
  resignationForm: FormGroup;
  notaryResignationDto: NotaryResignationDto = new NotaryResignationDto();
  workflowStageNotaryResignation = WorkflowStageNotaryResignation;
  workflowStageDocTypes: Array<WorkflowStageDocTypeDTO> = [];
  constructor(private route: ActivatedRoute,
              private notaryResignationService: NotaryResignationService,
              private snackBar: SnackBarService,
              private router: Router) { }

  ngOnInit() {
    this.resignationForm = new FormGroup({
      reason: new FormControl("", [Validators.required]),
    });
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.notaryResignationDto.id = param.id;
      }
    });
    this.notaryResignationService.getRelatedDocTypes(this.workflowStageNotaryResignation.NOTARY_RESIGNATION_INIT)
      .subscribe((result) => {
        if(result) {
          this.workflowStageDocTypes = result;
        }
      });
  }

  setFiles(files, key) {
    this.fileList[key] = files;
  }
  get FormControls() {
    return this.resignationForm.controls;
  }

  makeResignationRequest() {
    this.notaryResignationDto.reason = this.resignationForm.controls.reason.value;
    this.notaryResignationDto.workflowStageCode = this.workflowStageNotaryResignation.NOTARY_RESIGNATION_INIT;
    this.notaryResignationService.makeDesignationRequest(this.fileList, this.notaryResignationDto)
      .subscribe((result) => {
        if (result) {
          this.snackBar.success('Successfully submitted');
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.error('Operation failed');
        }
      });
  }
}
