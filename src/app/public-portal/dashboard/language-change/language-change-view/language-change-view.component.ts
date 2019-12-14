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
import { NewNotaryPaymentDetailDto } from 'src/app/shared/dto/new-notary-payment-detail.dto';

@Component({
  selector: 'app-language-change-view',
  templateUrl: './language-change-view.component.html',
  styleUrls: ['./language-change-view.component.css']
})
export class LanguageChangeViewComponent implements OnInit {
  backUrl: string;
  workflow: string;
  requestId: number;
  paymentHistory: NewNotaryPaymentDetailDto[] = [];

  constructor(private route: ActivatedRoute,
              private langChangeService: LanguageChangeService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.backUrl = this.langChangeService.setBase64(Workflow.LANGUAGE_CHANGE);
    this.route.paramMap.subscribe(param => {
      this.requestId = +this.langChangeService.decodeBase64(param.get('id'));
      this.getLanguageChangePaymentHistory(this.requestId);
    });
  }

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

}
