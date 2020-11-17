import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NotaryResignationDto} from "../../../shared/dto/notary-resignation-dto";
import {NotaryResignationService} from "../../../shared/service/notary-resignation.service";
import {WorkflowStageNotaryResignation} from "../../../shared/enum/workflow-stage-notary-resignation.enum";
import {WorkflowStageDocTypeDTO} from "../../../shared/dto/workflow-stage-doc-type-dto";
import {SnackBarService} from "../../../shared/service/snack-bar.service";
import {SessionService} from '../../../shared/service/session.service';
import {SystemService} from '../../../shared/service/system.service';
import {SysMethodsService} from '../../../shared/service/sys-methods.service';

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
  oldResignation: NotaryResignationDto = new NotaryResignationDto();
  registrationExist: boolean = false;

  constructor(private route: ActivatedRoute,
              private notaryResignationService: NotaryResignationService,
              private snackBar: SnackBarService,
              private sessionService: SessionService,
              private sysMethodsService: SysMethodsService,
              public router: Router,
              private systemService: SystemService) { }

  ngOnInit() {
    this.resignationForm = new FormGroup({
      reason: new FormControl("", [Validators.required,this.sysMethodsService.noWhitespaceValidator]),
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

    this.getResignationRequest();
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
          this.snackBar.success(this.systemService.getTranslation('ALERT.MESSAGE.SUBMITTED_SUCCESS'));
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.error(this.systemService.getTranslation('ALERT.MESSAGE.OPERATION_FAILED'));
        }
      });
  }

  getResignationRequest(){
    const id = this.sessionService.getUser().id;
    this.notaryResignationService.getResignationByNoatry(id)
      .subscribe((result: NotaryResignationDto ) => {
        if (result) {
          this.oldResignation = result;
          this.registrationExist = true;
        } else {

        }
      });
  }
}
