import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog} from '@angular/material';
import {FolioViewComponent} from '../../../../../../shared/components/folio-view/folio-view.component';
import {SearchFolioResultType} from '../../../../../../shared/enum/search-folio-result-type.enum';

@Component({
  selector: 'app-search-document-result',
  templateUrl: './search-document-result.component.html',
  styleUrls: ['./search-document-result.component.css']
})
export class SearchDocumentResultComponent implements OnInit {

  folioList: any[] = [];

  isRemark: boolean;

    SearchFolioResultType = SearchFolioResultType;

  constructor(private _bottomSheetRef: MatBottomSheetRef<SearchDocumentResultComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any[],
              private dialog: MatDialog,) {
    this.folioList = data;
    if (this.folioList.length == 1) {
     this.isRemark = this.folioList[0].type == SearchFolioResultType.REMARK;

    }
  }

  ngOnInit() {
  }

  onClickItem(item: any) {
    this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: item.folioNoWithLR});
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
