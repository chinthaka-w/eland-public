import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog} from '@angular/material';
import {FolioViewComponent} from '../../../../../../shared/components/folio-view/folio-view.component';
import {SearchRequestService} from '../../../../../../shared/service/search-request.service';
import {MatTableDataSource} from '@angular/material/table';
import {SnackBarService} from '../../../../../../shared/service/snack-bar.service';
import {DocumentService} from '../../../../../../shared/service/document.service';
import {DocumentDTO} from '../../../../../../shared/dto/document-dto';
import {SearchResultType} from '../../../../../../shared/enum/search-result-type.enum';

@Component({
  selector: 'app-search-document-result',
  templateUrl: './search-document-result.component.html',
  styleUrls: ['./search-document-result.component.css']
})
export class SearchDocumentResultComponent implements OnInit, OnChanges {

  @Input() workflowStageCode: string;
  @Input() requestId: any;

  SearchResultType = SearchResultType;

  //Mat Table Config
  public elements: Element[] = [];
  public displayedColumns: string[] = ['Folio No', 'Action'];
  public dataSource = new MatTableDataSource<any>(this.elements);

  documentDTO: DocumentDTO;

  resultType: any = 0;

  remark: any;

  constructor(private dialog: MatDialog,
              private searchRequestService: SearchRequestService,
              private snackBarService: SnackBarService,
              private documentService: DocumentService,) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requestId']) this.loadResultSet();
  }

  onClickItem(item: Element) {
    this.dialog.open(FolioViewComponent, {width: '90%', height: '90%', data: item.folioNoWithLR});
  }

  getDocument(docId: any) {
    this.documentService.getDocumentById(docId).subscribe(
      (data: any) => {
        this.documentDTO = data;
      }
    );
  }

  loadResultSet() {
    this.searchRequestService.getSearchResultsBySearchRequestId(this.requestId).subscribe(
      (data: Element[]) => {
        this.elements = data;
      }, (error) => {
        console.log(error);
      }, () => {
        if (this.elements && this.elements.length !== 0) {
          this.resultType = this.elements[0].type;
          this.getData(this.elements[0]);
        }
      }
    );
  }

  getData(item: Element) {
    if (this.resultType == this.SearchResultType.DEED) {
      this.getDocument(item.docId);
    } else if (this.resultType == this.SearchResultType.REMARK) {
      this.remark = item.remark;
    } else  if (this.resultType == this.SearchResultType.FOLIO)  {
      this.dataSource.data = this.elements;
    }
  }


}

export interface Element {
  index: number;
  folioNo: string;
  folioNoWithLR: string;
  type: number;
  docId: number;
  remark: string;
}
