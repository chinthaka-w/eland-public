import { ActivatedRoute } from '@angular/router';
import { RequestResponse } from './../../../shared/dto/request-response.model';
import { CorrectionRequestService } from './../../../shared/service/correction-request.service';
import { Workflow } from './../../../shared/enum/workflow.enum';
import { Component, OnInit } from '@angular/core';
import { NotaryRegistrationHistoryDto } from 'src/app/shared/dto/notary-registration-history.dto';

@Component({
  selector: 'app-request-for-correction-view',
  templateUrl: './request-for-correction-view.component.html',
  styleUrls: ['./request-for-correction-view.component.css']
})
export class RequestForCorrectionViewComponent implements OnInit {
  workflow = Workflow;
  remarkHistory: NotaryRegistrationHistoryDto[];

  constructor(private correctionRequestService: CorrectionRequestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getRequestHistory(+this.decodeBase64(params.get('id')));
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

  getBase64Url(url: string): string {
    return btoa(url);
  }

  decodeBase64(url: string) {
    return atob(url);
  }

}
