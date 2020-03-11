import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folio-view',
  templateUrl: './folio-view.component.html',
  styleUrls: ['./folio-view.component.css']
})
export class FolioViewComponent implements OnInit {

  showTransaction: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
