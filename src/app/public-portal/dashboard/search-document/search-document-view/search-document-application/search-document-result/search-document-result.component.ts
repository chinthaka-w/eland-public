import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-search-document-result',
  templateUrl: './search-document-result.component.html',
  styleUrls: ['./search-document-result.component.css']
})
export class SearchDocumentResultComponent implements OnInit {

  folioList:any[] =[];

  constructor(private _bottomSheetRef: MatBottomSheetRef<SearchDocumentResultComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any[]) {
    this.folioList = data;
  }

  ngOnInit() {
  }

  onClickItem(event: any) {
    alert(event);
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
