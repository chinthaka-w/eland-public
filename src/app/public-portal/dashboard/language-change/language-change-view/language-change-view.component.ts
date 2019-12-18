import { NewNotaryPaymentDetailDto } from 'src/app/shared/dto/new-notary-payment-detail.dto';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { NotaryPaymentInfoComponent } from './../../view-notary/notary-payment-info/notary-payment-info.component';
import { LanguageChangeService } from './../../../../shared/service/language-change.service';
import { SessionService } from 'src/app/shared/service/session.service';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from './../../../../shared/enum/workflow.enum';
import { LanguageChange } from './../../../../shared/dto/language-change.model';
import { WorkflowStages } from './../../../../shared/enum/workflow-stages.enum';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { RequestSearchDetailDTO } from 'src/app/shared/dto/request-search.dto';
import { LanguageChangeWorkflowStages } from 'src/app/shared/enum/language-change-workflow-stages.enum';
import { NotaryRegistrationHistoryDto } from 'src/app/shared/dto/notary-registration-history.dto';

@Component({
  selector: 'app-language-change-view',
  templateUrl: './language-change-view.component.html',
  styleUrls: ['./language-change-view.component.css']
})
export class LanguageChangeViewComponent implements OnInit {
  backUrl: string;
  workflow: string;
  requestId: number;
  paymentAction: boolean;
  remarkHistory: NotaryRegistrationHistoryDto[] = [];
  workflowStage: string;
  paymentHistory: NewNotaryPaymentDetailDto[] = [];

  constructor(private route: ActivatedRoute,
              private langChangeService: LanguageChangeService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.backUrl = this.langChangeService.setBase64(Workflow.LANGUAGE_CHANGE);
    this.route.paramMap.subscribe(params => {
      this.requestId = +this.langChangeService.decodeBase64(params.get('id'));
      this.workflowStage = this.langChangeService.decodeBase64(params.get('workflowStage'));
      this.paymentAction = this.configPaymentOption();
      this.getLanguageChangePaymentHistory(this.requestId);
      this.getLanguageChangeRemarkHisoty(this.requestId);
    });
  }

  /**
   * Get all payment history details for a given language change request id
   * @param reqId language change request id
   */
  getLanguageChangePaymentHistory(reqId: number): void {
    this.langChangeService.getApplicationPaymentHistory(reqId).subscribe(
      (result: NewNotaryPaymentDetailDto[]) => {
        this.paymentHistory = result;
      },
      (error) => {
        this.snackBarService.error('Error in retrieving data!');
      }
    );
  }

  getLanguageChangeRemarkHisoty(reqId: number): void {
    this.langChangeService.getApplicationRemarkHistory(reqId).subscribe(
      (result: NotaryRegistrationHistoryDto[]) => {
        this.remarkHistory = result;
      },
      (error) => {
        this.snackBarService.error('Error in retrieving data!');
      }
    );
  }

  /**
   * Enable show/hide config of the payment option base on workflow stage
   */
  configPaymentOption(): boolean {
    if (this.workflowStage === LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT) {
      return false;
    }
  }

}
