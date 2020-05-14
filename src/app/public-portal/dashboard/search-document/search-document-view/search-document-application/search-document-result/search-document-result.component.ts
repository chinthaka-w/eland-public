import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog, MatDialogConfig} from '@angular/material';
import {FolioViewComponent} from '../../../../../../shared/components/folio-view/folio-view.component';
import {SearchRequestService} from '../../../../../../shared/service/search-request.service';
import {MatTableDataSource} from '@angular/material/table';
import {SnackBarService} from '../../../../../../shared/service/snack-bar.service';
import {DocumentService} from '../../../../../../shared/service/document.service';
import {DocumentDTO} from '../../../../../../shared/dto/document-dto';
import {SearchResultType} from '../../../../../../shared/enum/search-result-type.enum';
import {DocumentViewerComponent} from '../../../../../../shared/components/document-viewer/document-viewer.component';
import {FolioService} from '../../../../../../shared/service/folio.service';

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
  public displayedColumns: string[] = ['Folio No','Remark', 'Action'];
  public dataSource = new MatTableDataSource<any>(this.elements);


  selectedFiles: DocumentDTO[] = [];

  resultType: any = 0;

  remark: any;

  constructor(private dialog: MatDialog,
              private searchRequestService: SearchRequestService,
              private snackBarService: SnackBarService,
              private folioService: FolioService,
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
      this.setSelectedFiles(this.elements);
    } else if (this.resultType == this.SearchResultType.REMARK) {
      this.remark = item.remark;
    } else if (this.resultType == this.SearchResultType.FOLIO) {
      this.dataSource.data = this.elements;
    }
  }

  setSelectedFiles(data: any) {
    for (let index in data) {
      this.selectedFiles.push(data[index].documentDTO);
    }
  }

  onClickViewImageButton(item: any) {
    this.folioService.findFolioDocuments(item.folioNoWithLR).subscribe(
      (data: any) => {
        if (data) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            files: data.documents
          };
          dialogConfig.width = '90vw';
          dialogConfig.maxHeight = '98vh';
          dialogConfig.minHeight = '50vh';
          let dialogRef = this.dialog.open(DocumentViewerComponent, dialogConfig);

        }
      }
    );
  }

}

export interface Element {
  index: number;
  folioNo: string;
  folioNoWithLR: string;
  type: number;
  docId: number;
  remark: string;
  documentDTO: any;
}
