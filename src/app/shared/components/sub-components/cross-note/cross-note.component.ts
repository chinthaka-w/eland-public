import { Component, OnInit, Input } from '@angular/core';
import { FolioService } from 'src/app/shared/service/folio.service';

@Component({
  selector: 'app-cross-note',
  templateUrl: './cross-note.component.html',
  styleUrls: ['./cross-note.component.css']
})
export class CrossNoteComponent implements OnInit {

  @Input()
  referenceFolioList;

  @Input()
  uiController;

  @Input()
  landRegistries;

  @Input()
  newFolioDto;

  @Input()
  selectedLrDivision;

  public crossNotes = [];
  public selectedCrossNote = {};

  constructor(
    private folioService: FolioService
  ) { }

  ngOnInit() {
  }

  getCrossNote() {
    this.folioService
      .getCrossNote()
      .subscribe((crossNotes: any[]) => {
        this.crossNotes = crossNotes;
      });
  }

  selectCrossNote(crossNoteIndex, index) {
    this.referenceFolioList[index].note = this.crossNotes[crossNoteIndex].descriptionSin;
    this.referenceFolioList[index].crossNoteId = this.crossNotes[crossNoteIndex].folioCrossNoteId;
  }

  removeReferenceFolio(index) {
    this.referenceFolioList.splice(index, 1);
  }

  // addReferenceFolio(folioCode) {
  //   this.referenceFolioList.push({ folioCode: folioCode });
  // }

  openDialog(): void {
    // const dialogRef = this.dialog.open(FolioCodePopupComponent, {data: {landRegistries: this.landRegistries}, width: '500px'});

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result)this.referenceFolioList.push(result);
    // });
  }

}
