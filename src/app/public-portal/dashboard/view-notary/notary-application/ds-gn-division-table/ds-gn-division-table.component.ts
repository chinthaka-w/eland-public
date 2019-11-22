import {Component, Input, OnInit} from '@angular/core';
import {NewNotaryGnDivisionDTO} from "../../../../../shared/dto/new-notary-gn-division.model";

@Component({
  selector: 'app-ds-gn-division-table',
  templateUrl: './ds-gn-division-table.component.html',
  styleUrls: ['./ds-gn-division-table.component.css']
})
export class DsGnDivisionTableComponent implements OnInit {
  @Input() dsGnDivisions: NewNotaryGnDivisionDTO[] = [];

  constructor() { }

  ngOnInit() {
  }

}
