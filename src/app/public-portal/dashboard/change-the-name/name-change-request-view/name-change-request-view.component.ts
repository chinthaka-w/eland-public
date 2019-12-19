import { Component, OnInit } from '@angular/core';
import {WorkflowStages} from "../../../../shared/enum/workflow-stages.enum";
import {ActivatedRoute} from "@angular/router";
import {DocumentResponseDto} from "../../../../shared/dto/document-response.dto";
import {RequestSearchDetailDTO} from "../../../../shared/dto/request-search.dto";
import {NotaryService} from "../../../../shared/service/notary-service";
import {SessionService} from "../../../../shared/service/session.service";
import {Notary} from "../../../../shared/dto/notary.model";
import {NotaryNameChangeModel} from "../../../../shared/dto/notary-name-change.model";

@Component({
  selector: 'app-name-change-request-view',
  templateUrl: './name-change-request-view.component.html',
  styleUrls: ['./name-change-request-view.component.css']
})
export class NameChangeRequestViewComponent implements OnInit {
  public docsList: DocumentResponseDto[] = [];
  public nameChangeDetails: NotaryNameChangeModel;
  requestId: string;
  WorkflowCode = WorkflowStages;
  id: number;
  workflow: string;

  constructor(private route: ActivatedRoute,
              private newNotaryService: NotaryService,
              private sessionService: SessionService) {
    this.route.params.subscribe(params => {
      this.workflow  = atob(params['workflow']);
      this.requestId  = atob(params['id']);
      this.id = +this.requestId;
    });

  }



  ngOnInit() {
  }

  // getRequestDetails(){
  //   this.newNotaryService.getNotaryRequestDetails(this.sessionService.getUser().id).subscribe(
  //     (data: RequestSearchDetailDTO) =>{
  //       this.requestId = data;
  //       this.workflow = data.workflow;
  //     }
  //   )
  // }

  getApplicationDetails(data: NotaryNameChangeModel){
    this.nameChangeDetails = data;
  }

  getSupportingDocs(data: DocumentResponseDto[]){
    this.docsList = data;
  }


}
