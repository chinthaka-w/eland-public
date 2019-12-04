import { Component, OnInit } from '@angular/core';
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";

@Component({
  selector: 'app-supporting-doc-detail',
  templateUrl: './supporting-doc-detail.component.html',
  styleUrls: ['./supporting-doc-detail.component.css']
})
export class SupportingDocDetailComponent implements OnInit {
  documentImages: string[] = [];


  constructor(private notaryService: NewNotaryDataVarificationService) { }

  ngOnInit() {
    this.getDocumentPreview();
  }

  getDocumentPreview(): void{
    this.notaryService.loadDocImages.subscribe(
      (result:string[])=> {
        console.log(result);
        this.documentImages = result;
      }
    );
  }

}
