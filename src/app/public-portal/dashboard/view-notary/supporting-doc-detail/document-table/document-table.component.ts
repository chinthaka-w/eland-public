import { Component, OnInit } from '@angular/core';
import {NewNotarySupportingDocDetailDto} from "../../../../../shared/dto/new-notary-supporting-doc-detail.dto";
import {ApplicationRequestDataType} from "../../../../../shared/enum/application-request-data-type.enum";
import {FormArray, FormGroup} from "@angular/forms";
import {NewNotaryRequestsCategorySearchDto} from "../../../../../shared/dto/new-notary-requests-category-search.dto";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NewNotaryDataVarificationService} from "../../../../../shared/service/new-notary-data-varification.service";

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.css']
})
export class DocumentTableComponent implements OnInit {
  item1: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  item2: NewNotarySupportingDocDetailDto = new NewNotarySupportingDocDetailDto();
  selectedRow: number = 1;

  supportingDocuments: NewNotarySupportingDocDetailDto[] = [];
  supportingDocForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private notaryService: NewNotaryDataVarificationService) {
    this.item1.id =1;
    this.item1.name = 'name1';
    this.item1.statusCode = false;

    this.supportingDocuments.push(this.item1);
  }

  ngOnInit() {
    this.getDocumentDetails();
    this.supportingDocForm = new FormGroup({
      remarks: new FormArray([])
    });
    this.verifySupportingDocuments();
  }

  getDocumentDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(1,"1");
    // this.route.paramMap.subscribe(params => {
    //   searchType.requestID = params.get('id')
    // });
    searchType.type = ApplicationRequestDataType.SUPPORTING_DOC;

    this.notaryService.getDocumentDetails(searchType).subscribe(
      (result: NewNotarySupportingDocDetailDto[]) => {
        this.supportingDocuments = result;
        console.log('Documents...'+this.supportingDocuments);
        this.notaryService.loadDocImages.emit(result[0].document);
      },
      error1 => console.log(error1)
    );
  }

  onDocumentClick(id: number, docs: string[]): void {
    this.selectedRow = id;
    // this.notaryService.getDocumentPreview(docs);
    this.notaryService.loadDocImages.emit(docs);
  }

  onChangeValidity(doc: NewNotarySupportingDocDetailDto, index: number) {
    doc.statusCode = !doc.statusCode;
    this.supportingDocuments[index] = doc;

    this.verifySupportingDocuments();
  }

  verifySupportingDocuments(){
    this.notaryService.verifySupportingDocuments(this.supportingDocuments);
  }


}
