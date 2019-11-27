import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.css']
})
export class SearchDocumentComponent implements OnInit {

  displayedColumns: string[] = ['division', 'volNo'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() { }

  ngOnInit() {
  }
}

export interface Element {
  division: string;
  volNo: string;
}

const ELEMENT_DATA: Element[] = [
  { division: 'Hydrogen',volNo: "Yes" },
  { division: 'Hydrogen',volNo: "Yes" }
];
