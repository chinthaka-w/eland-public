import { Component, OnInit } from '@angular/core';
import {JudicialChangeWorkflowStagesEnum} from '../../../../shared/enum/judicial-change-workflow-stages.enum';
import {WorkflowStages} from '../../../../shared/enum/workflow-stages.enum';
import {ActivatedRoute} from '@angular/router';
import {LandRegistryModel} from '../../../../shared/dto/land-registry.model.';
import {JudicialZoneService} from '../../../../shared/service/judicial-zone.service';
import {JudicialChange} from '../../../../shared/dto/judicial-change-model';
import {JudicialService} from '../../../../shared/service/change-judicial-service';

@Component({
  selector: 'app-judicial-change-request-view',
  templateUrl: './judicial-change-request-view.component.html',
  styleUrls: ['./judicial-change-request-view.component.css']
})
export class JudicialChangeRequestViewComponent implements OnInit {
  WorkflowCode = WorkflowStages;
  id: number;
  workflow: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workflow  = params['workflow'];
      this.id  = params['id'];
    });


  }


}
