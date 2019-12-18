import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { LanguageChange } from './../../../../../shared/dto/language-change.model';
import { ActivatedRoute } from '@angular/router';
import { LanguageChangeService } from './../../../../../shared/service/language-change.service';
import { NameTitleDTO } from './../../../../../shared/dto/name-title.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lang-change-application',
  templateUrl: './lang-change-application.component.html',
  styleUrls: ['./lang-change-application.component.css']
})
export class LangChangeApplicationComponent implements OnInit {
  langChangeViewForm: FormGroup;
  nameTitles: NameTitleDTO[];
  requestId: number;
  workflowStageCode: string;
  langChangeRequest: LanguageChange;

  constructor(private formBuilder: FormBuilder,
              private langChangeService: LanguageChangeService,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.viewApplication();
    this.getRoutingParams();
  }

  getRoutingParams(): void {
    this.route.paramMap.subscribe(params => {
      this.requestId = +this.langChangeService.decodeBase64(params.get('id'));
      this.workflowStageCode = this.langChangeService.decodeBase64(params.get('workflow'));
      this.getNameTitles();
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
    this.langChangeViewForm.disable();
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
      },
      (error) => {
        this.snackBarService.error('Error retrieving data!');
      }
    );
  }

}
