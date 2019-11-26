import {Component, Input, OnInit} from '@angular/core';
import {NewNotaryDsDivisionDTO} from "../../../../../shared/dto/new-notary-ds-division.model";

@Component({
  selector: 'app-ds-gn-division-table',
  templateUrl: './ds-gn-division-table.component.html',
  styleUrls: ['./ds-gn-division-table.component.css']
})
export class DsGnDivisionTableComponent implements OnInit {
  @Input() dsGnDivisions: NewNotaryDsDivisionDTO[] = [];

  constructor() { }

  ngOnInit() {
  }

}
