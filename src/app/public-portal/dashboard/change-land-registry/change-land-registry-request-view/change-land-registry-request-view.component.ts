import { Component, OnInit } from '@angular/core';
import {WorkflowStages} from '../../../../shared/enum/workflow-stages.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {JudicialService} from '../../../../shared/service/change-judicial-service';
import {NotaryService} from '../../../../shared/service/notary-service';
import {FormControl, FormGroup} from '@angular/forms';
import {ChangeLandRegistryService} from '../../../../shared/service/change-land-registry.service';
import {LandRegistryChangeRequestModel} from '../../../../shared/dto/land-registry-change-request.model';

@Component({
  selector: 'app-change-land-registry-request-view',
  templateUrl: './change-land-registry-request-view.component.html',
  styleUrls: ['./change-land-registry-request-view.component.css']
})
export class ChangeLandRegistryRequestViewComponent implements OnInit {

  requestId: string;
  WorkflowCode = WorkflowStages;
  id: number;
  workflow: string;
  getData: LandRegistryChangeRequestModel;
  requestForm: FormGroup;

  constructor(private route: ActivatedRoute, private newNotaryService: NotaryService, private snackBar: SnackBarService,
              private judicialService: JudicialService, private router: Router,
              private changelandRegistryService: ChangeLandRegistryService) {
    this.route.params.subscribe(params => {
      this.workflow  = atob(params['workflow']);
      this.requestId  = atob(params['id']);
      this.id = +this.requestId;
    });
  }

  ngOnInit() {

    this.requestForm = new FormGroup({
      notaryName: new FormControl(),
      notaryId: new FormControl(),
      address: new FormControl(),
      newLandregistry: new FormControl(),
      reason: new FormControl()

    });
    this.getRequestData();
  }

  getRequestData(): void {
    this.changelandRegistryService.getRequestData(this.id).subscribe(
      (data: LandRegistryChangeRequestModel) => {
        this.getData = data;
        this.requestForm.patchValue(
          {
            notaryName: this.getData.notaryName,
            notaryId: this.getData.notaryId,
            address: this.getData.address,
            reason: this.getData.reasonForChange,
            newLandregistry: this.getData.landRegistryname,


          });
      }
    );


  }

}
