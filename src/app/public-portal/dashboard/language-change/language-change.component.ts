import { WorkflowStageDocDto } from './../../../shared/dto/workflow-stage-doc-dto';
import { Languages } from './../../../shared/enum/languages.enum';
import {NameTitleDTO} from './../../../shared/dto/name-title.dto';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {LanguageChangeService} from 'src/app/shared/service/language-change.service';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {SessionService} from '../../../shared/service/session.service';
import {LanguageChange} from '../../../shared/dto/language-change.model';
import { LanguageChangeWorkflowStages } from 'src/app/shared/enum/language-change-workflow-stages.enum';

@Component({
  selector: 'app-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.css']
})
export class LanguageChangeComponent implements OnInit {
  nameTitles: NameTitleDTO[] = [];
  languageChangForm: FormGroup;
  langMode = Languages;

  constructor(private languageChangeService: LanguageChangeService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.getSupportingDocs(LanguageChangeWorkflowStages.LANGUAGE_CHANGE_REQUEST_INIT);
    this.getNameTitles();
    this.loadForm();
    this.getRegistrationDetails(this.sessionService.getUser().id);
  }

  /**
   * Load language change application form
   */
  private loadForm(): void {
    this.languageChangForm = new FormGroup({
      title: new FormControl('0', Validators.required),
      langEng: new FormControl(false, null),
      langSin: new FormControl(false, null),
      langTam: new FormControl(false, null),
      fullNameEng: new FormControl('', null),
      fullNameSin: new FormControl('', null),
      fullNameTam: new FormControl('', null),
      nameWithInitEng: new FormControl('', null),
      nameWithInitSin: new FormControl('', null),
      nameWithInitTam: new FormControl('', null),
      addPermanentEng: new FormControl('', null),
      addPermanentSin: new FormControl('', null),
      addPermanentTam: new FormControl('', null),
      addressEng: new FormControl('', null),
      addressSin: new FormControl('', null),
      addressTam: new FormControl('', null),
      startingDate: new FormControl('', null),
      highCourtCertificateYear: new FormControl('', null),
      lrName: new FormControl('', null),
      returnAttestedStatus: new FormControl('', null),
      unavailableTimePeriod: new FormControl('', null),
      date: new FormControl('', null)
    });
  }

  private getNameTitles() {
    this.languageChangeService.getNameTitle().subscribe(
      (result: NameTitleDTO[]) => {
        this.nameTitles = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  private getRegistrationDetails(id: number): void {
    this.languageChangeService.getRegistrationDetails(id).subscribe(
      (result: LanguageChange) => {
        console.log(result);
        this.languageChangForm.setValue({result});
      },
      error => {
        console.log(error);
      }
    );
  }

  continue(): void {
    console.log('form', this.languageChangForm.value);
  }

  getSupportingDocs(workflwStage: string): void {
    this.languageChangeService.loadSupportingDocs(workflwStage).subscribe(
      (result: WorkflowStageDocDto[]) => {
        console.log('docs', result);
      },
      error => {
        console.log(error);
      }
    );
  }

/**
 * Applicant language change request only applicable for one at a time
 * Only one value can be select
 */
  languageChange(code: number): void {
    if (code === this.langMode.SINHALA) {
      this.languageChangForm.patchValue({
        langEng: false,
        langTam: false
      });
    } else if (code === this.langMode.ENGLISH) {
      this.languageChangForm.patchValue({
        langSin: false,
        langTam: false
      });
    } else if (code === this.langMode.TAMIL) {
      this.languageChangForm.patchValue({
        langSin: false,
        langEng: false
      });
    }
  }

}
