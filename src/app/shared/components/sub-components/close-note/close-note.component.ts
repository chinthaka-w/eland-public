import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';

@Component({
  selector: 'app-close-note',
  templateUrl: './close-note.component.html',
  styleUrls: ['./close-note.component.css']
})
export class CloseNoteComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  closeNote;

  @Input()
  referenceFolioList: any[];

  constructor() { }

  ngOnInit() {
  }

}
