import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NewNotaryDsDivisionDTO} from "../../../../../shared/dto/new-notary-ds-division.model";
import {MatTableDataSource} from "@angular/material/table";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-ds-gn-division-table',
  templateUrl: './ds-gn-division-table.component.html',
  styleUrls: ['./ds-gn-division-table.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class DsGnDivisionTableComponent implements OnInit,OnChanges {
  @Input() dsGnDivisions: NewNotaryDsDivisionDTO[] = [];
  displayedColumns: string[] = ['DS Division', 'GN Division'];
  dataSource = new MatTableDataSource<NewNotaryDsDivisionDTO>(this.dsGnDivisions);

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges',this.dsGnDivisions);
  }

}
