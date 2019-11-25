import { Component, OnInit } from '@angular/core';
import {NewNotaryDataVarificationService} from "../../../../../shared/service/new-notary-data-varification.service";

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})
export class DocumentPreviewComponent implements OnInit {
  documentImages: string[] = [];

  constructor(private notaryService: NewNotaryDataVarificationService) {
  }

  ngOnInit() {
    this.getDocumentPreview();
  }

  getDocumentPreview(): void{
    this.notaryService.loadDocImages.subscribe(
      (result:string[])=> {
        this.documentImages = result;
      }
    );
  }

}
