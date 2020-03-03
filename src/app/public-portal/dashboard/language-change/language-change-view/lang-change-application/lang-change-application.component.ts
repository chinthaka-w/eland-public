import { Languages } from './../../../../../shared/enum/languages.enum';
import { SessionService } from './../../../../../shared/service/session.service';
import { Workflow } from './../../../../../shared/enum/workflow.enum';
import { CommonStatus } from './../../../../../shared/enum/common-status.enum';
import { StatusDTO } from './../../../../../shared/dto/status-dto';
import { LanguageChangeWorkflowStages } from './../../../../../shared/enum/language-change-workflow-stages.enum';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { LanguageChange } from './../../../../../shared/dto/language-change.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageChangeService } from './../../../../../shared/service/language-change.service';
import { NameTitleDTO } from './../../../../../shared/dto/name-title.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lang-change-application',
  templateUrl: './lang-change-application.component.html',
  styleUrls: ['./lang-change-application.component.css']
})
export class LangChangeApplicationComponent implements OnInit {
  viewUpdate: boolean;
  langChangeViewForm: FormGroup;
  nameTitles: NameTitleDTO[];
  requestId: number;
  langMode = Languages;
  workflowStageCode: string;
  langChangeRequest: LanguageChange;
  langEngCheck: boolean;
  langSinCheck: boolean;
  langTamCheck: boolean;

  constructor(private formBuilder: FormBuilder,
              private langChangeService: LanguageChangeService,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService,
              private router: Router,
              private sessionService: SessionService) { }

  ngOnInit() {
    this.getRoutingParams();
  }

  getRoutingParams(): void {
    this.route.paramMap.subscribe(params => {
      this.requestId = +this.langChangeService.decodeBase64(params.get('id'));
      this.workflowStageCode = this.langChangeService.decodeBase64(params.get('workflowStage'));
      this.getNameTitles();
      this.viewApplication();
    });
  }

  viewApplication(): void {
    this.langChangeViewForm = this.formBuilder.group({
      title: [null, null],
      langEng: [null, null],
      langSin: [null, null],
      langTam: [null, null],
      fullNameEng: [null, null],
      fullNameSin: [null, null],
      fullNameTam: [null, null],
      nameWithInitEng: [null, null],
      nameWithInitSin: [null, null],
      nameWithInitTam: [null, null],
      addPermanentEng: [null, null],
      addPermanentSin: [null, null],
      addPermanentTam: [null, null],
      addressEng: [null, null],
      addressSin: [null, null],
      addressTam: [null, null],
      startingDate: [null, null],
      highCourtCertificateYear: [null, null],
      lrName: [null, null],
      returnAttestedStatus: [null, null],
      unavailableTimePeriod: [null, null],
      date: [null, null]
    });

    if (this.workflowStageCode !== LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_RETURN_DVC) {
      this.langChangeViewForm.disable();
    }
    if (this.workflowStageCode === LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_RETURN_DVC) {
      this.viewUpdate = true;
    }
  }

  getNameTitles(): void {
    this.langChangeService.getNameTitle().subscribe(
      (result: NameTitleDTO[]) => {
        this.nameTitles = result;
        this.getApplicationDetails(this.requestId);
      }
    );
  }

  getApplicationDetails(id: number): void {
    this.langChangeService.getApplicationDetails(id).subscribe(
      (result: LanguageChange) => {
        this.langChangeRequest = result;
        this.langChangeViewForm.patchValue(this.langChangeRequest);
        // enable edit form
        if (this.workflowStageCode === LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_RETURN_DVC) {
          if (result.langEng) {
            this.langChangeViewForm.get('langEng').disable();
          }
          if (result.langSin) {
            this.langChangeViewForm.get('langSin').disable();
          }
          if (result.langTam) {
            this.langChangeViewForm.get('langTam').disable();
          }
          this.langEngCheck = result.langEng;
          this.langSinCheck = result.langSin;
          this.langTamCheck = result.langTam;
        }
      },
      (error) => {
        this.snackBarService.error('Error retrieving data!');
      }
    );
  }

/**
 * Applicant language change request only applicable for one at a time
 * Only one value can be select
 */

languageChange(code: number): void {
  this.langChangeViewForm = this.formBuilder.group({
    title: [this.langChangeViewForm.value.title, [Validators.required]],
    langEng: [this.langEngCheck, null],
    langSin: [this.langSinCheck, null],
    langTam: [this.langTamCheck, null],
    fullNameEng: [this.langChangeViewForm.value.fullNameEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
    fullNameSin: [this.langChangeViewForm.value.fullNameSin, code === this.langMode.SINHALA ? [Validators.required] : null],
    fullNameTam: [this.langChangeViewForm.value.fullNameTam, code === this.langMode.TAMIL ? [Validators.required] : null],
    nameWithInitEng: [this.langChangeViewForm.value.nameWithInitEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
    nameWithInitSin: [this.langChangeViewForm.value.nameWithInitSin, code === this.langMode.SINHALA ? [Validators.required] : null],
    nameWithInitTam: [this.langChangeViewForm.value.nameWithInitTam, code === this.langMode.TAMIL ? [Validators.required] : null],
    addPermanentEng: [this.langChangeViewForm.value.addPermanentEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
    addPermanentSin: [this.langChangeViewForm.value.addPermanentSin, code === this.langMode.SINHALA ? [Validators.required] : null],
    addPermanentTam: [this.langChangeViewForm.value.addPermanentTam, code === this.langMode.TAMIL ? [Validators.required] : null],
    addressEng: [this.langChangeViewForm.value.addressEng, code === this.langMode.ENGLISH ? [Validators.required] : null],
    addressSin: [this.langChangeViewForm.value.addressSin, code === this.langMode.SINHALA ? [Validators.required] : null],
    addressTam: [this.langChangeViewForm.value.addressTam, code === this.langMode.TAMIL ? [Validators.required] : null],
    startingDate: [this.langChangeViewForm.value.startingDate, [Validators.required]],
    highCourtCertificateYear: [this.langChangeViewForm.value.highCourtCertificateYear, [Validators.required]],
    lrName: [this.langChangeViewForm.value.lrName, [Validators.required]],
    returnAttestedStatus: [this.langChangeViewForm.value.returnAttestedStatus, null],
    unavailableTimePeriod: [this.langChangeViewForm.value.unavailableTimePeriod, null],
    date: [this.langChangeViewForm.value.date, [Validators.required]]
  });
  // Disable already applied languages

  if (this.langChangeViewForm.value.langEng) {
    this.langChangeViewForm.get('langEng').disable();
  }
  if (this.langChangeViewForm.value.langSin) {
    this.langChangeViewForm.get('langSin').disable();
  }
  if (this.langChangeViewForm.value.langTam) {
    this.langChangeViewForm.get('langTam').disable();
  }

  // Enable checkbox input
  if (code === this.langMode.SINHALA) {
      if (!this.langChangeViewForm.get('langSin').disabled) {
      this.langChangeViewForm.patchValue({
        langSin: true
      });
    }
      if (!this.langChangeViewForm.get('langEng').disabled) {
      this.langChangeViewForm.patchValue({
        langEng: false
      });
    }
      if (!this.langChangeViewForm.get('langTam').disabled) {
      this.langChangeViewForm.patchValue({
        langTam: false
      });
    }

  } else if (code === this.langMode.ENGLISH) {
    if (!this.langChangeViewForm.get('langSin').disabled) {
      this.langChangeViewForm.patchValue({
        langSin: false
      });
    }
    if (!this.langChangeViewForm.get('langEng').disabled) {
      this.langChangeViewForm.patchValue({
        langEng: true
      });
    }
    if (!this.langChangeViewForm.get('langTam').disabled) {
      this.langChangeViewForm.patchValue({
        langTam: false
      });
    }

  } else if (code === this.langMode.TAMIL) {
    if (!this.langChangeViewForm.get('langSin').disabled) {
      this.langChangeViewForm.patchValue({
        langSin: false
      });
    }
    if (!this.langChangeViewForm.get('langEng').disabled) {
      this.langChangeViewForm.patchValue({
        langEng: false
      });
    }
    if (!this.langChangeViewForm.get('langTam').disabled) {
      this.langChangeViewForm.patchValue({
        langTam: true
      });
    }
  }
}

  update(): void {
    const model: LanguageChange = this.langChangeViewForm.value;
    model.workflowStage = LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_MODIFIED_NOTARY;
    this.langChangeService.updateApplication(this.langChangeViewForm.value).subscribe(
      (result: StatusDTO) => {
        if (result.code === CommonStatus.SUCCESS) {
          this.router.navigate([
            '/requests',
            this.langChangeService.setBase64(Workflow.LANGUAGE_CHANGE)]);

          this.snackBarService.success ('Application Update Successul!');
        }
      },
      (error) => {
        console.log('error message:-', error.message);
        this.snackBarService.error('Error in update application!');
      }
    );
  }

}
