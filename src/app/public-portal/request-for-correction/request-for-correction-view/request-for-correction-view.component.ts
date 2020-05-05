import { FileMeta } from './../../../shared/dto/file-meta.model';
import { SystemService } from 'src/app/shared/service/system.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { CommonStatus } from 'src/app/shared/enum/common-status.enum';
import { CorrectionRequest } from 'src/app/shared/dto/correction-request.model';
import { FolioCorrectionWorkflowStages } from './../../../shared/enum/folio-correction-workflow-stages.enum';
import { Workflow } from 'src/app/shared/enum/workflow.enum';
import { MetaKey } from './../../../shared/enum/meta-key.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestResponse } from './../../../shared/dto/request-response.model';
import { CorrectionRequestService } from './../../../shared/service/correction-request.service';
import { Component, OnInit } from '@angular/core';
import { NotaryRegistrationHistoryDto } from 'src/app/shared/dto/notary-registration-history.dto';
import { DocMetaKey } from 'src/app/shared/dto/doc-meta-key.model';

@Component({
  selector: 'app-request-for-correction-view',
  templateUrl: './request-for-correction-view.component.html',
  styleUrls: ['./request-for-correction-view.component.css']
})
export class RequestForCorrectionViewComponent implements OnInit {
  workflow = Workflow;
  remarkHistory: NotaryRegistrationHistoryDto[];
  docMetaKeys: DocMetaKey[] = [];
  metaKey = MetaKey;
  requestId: number;
  workflowStageCode: string;
  docUploadWorkflowStage: string;
  isEdit = false;
  isSubmit = false;
  showLastRemark = false;

  constructor(private correctionRequestService: CorrectionRequestService,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService,
              private systemService: SystemService,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.workflowStageCode = this.decodeBase64(params.get('workflowStage'));

      // form disable
      if (this.workflowStageCode === FolioCorrectionWorkflowStages.RL_RETURN) {
        this.isEdit = true;
        this.docUploadWorkflowStage = FolioCorrectionWorkflowStages.APPLICANT_INITIATE;
      }

      // set last remark
      if (this.workflowStageCode === FolioCorrectionWorkflowStages.RL_RETURN ||
        this.workflowStageCode === FolioCorrectionWorkflowStages.REQ_REJECTED_TO_APPLICANT_BY_ARL) {
        this.showLastRemark = true;
      }

      this.requestId = +this.decodeBase64(params.get('id'));
      this.getRequestHistory(this.requestId);
      this.setDocPreviewMeta();
    });
  }

  // get request history
  getRequestHistory(reqId: number) {
    this.correctionRequestService.getRequestHistory(reqId).subscribe(
      (response: RequestResponse) => {
        this.remarkHistory = response.data;
      }
    );
  }

  // document meta for Folio Correction
  setDocPreviewMeta(): void {
    const metaKey = {};
    metaKey['folioCorrectionReqId'] = this.requestId;
    this.docMetaKeys.push(metaKey);
  }

  getBase64Url(url: string): string {
    return btoa(url);
  }

  decodeBase64(url: string) {
    return atob(url);
  }

  onFormSubmit(): void {
    this.isSubmit = true;
    const correctionRequest = new CorrectionRequest();

    correctionRequest.workflowStageCode = FolioCorrectionWorkflowStages.APPLICANT_MODIFIED;
    correctionRequest.id = this.requestId;

    this.correctionRequestService.completeRequestUpdate(correctionRequest).subscribe(
      (response: RequestResponse) => {
        if (response.status === CommonStatus.SUCCESS) {
          this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.UPDATE_SUCCESS'));
        }
      },
      () => {
        this.snackBarService.error(this.systemService.getTranslation('ALERT.WARNING.INTERNAL_SERVER_ERROR'));
      },
      () => {
        this.isSubmit = false;
        this.router.navigate(['/requests', this.getBase64Url(Workflow.FOLIO_REQUEST_CORRECTION)]);
      }
    );
  }

}
