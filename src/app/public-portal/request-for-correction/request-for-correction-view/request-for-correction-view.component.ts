import { FolioCorrectionWorkflowStages } from './../../../shared/enum/folio-correction-workflow-stages.enum';
import { Workflow } from 'src/app/shared/enum/workflow.enum';
import { MetaKey } from './../../../shared/enum/meta-key.enum';
import { ActivatedRoute } from '@angular/router';
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
  isEdit = false;

  constructor(private correctionRequestService: CorrectionRequestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.workflowStageCode = this.decodeBase64(params.get('workflowStage'));

      // form disable
      if (this.workflowStageCode === FolioCorrectionWorkflowStages.RL_RETURN) {
        this.isEdit = true;
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

}
