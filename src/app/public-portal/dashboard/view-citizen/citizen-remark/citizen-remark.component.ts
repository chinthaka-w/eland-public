import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource} from "@angular/material/table";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {ActivatedRoute} from "@angular/router";
import {CitizenService} from "../../../../shared/service/citizen.service";
import {HistoryDTO} from "../../../../shared/dto/history-dto";
import {MatPaginator} from '@angular/material';

@Component({
  selector: 'app-citizen-remark',
  templateUrl: './citizen-remark.component.html',
  styleUrls: ['./citizen-remark.component.css'],
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
export class CitizenRemarkComponent implements OnInit {

  remarkList: HistoryDTO[] = [];

  displayedColumns: string[] = ['Workflow Stage', 'Remark', 'Created Time', 'Created User'];
  dataSource = new MatTableDataSource<HistoryDTO>(new Array<HistoryDTO>());

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private notaryService: NewNotaryDataVarificationService,
              private route: ActivatedRoute,
              private citizenService: CitizenService) { }

  ngOnInit() {
    // this.getHistoryDetails();
    this.citizenService.citizenDto.subscribe((result) => {
      this.dataSource = result.requestHistory;
      this.dataSource.paginator = this.paginator;
    });
  }

  // getHistoryDetails(){
  //   let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(1,"1");
  //   // this.route.paramMap.subscribe(params =>{
  //   //   searchType.requestID = params.get('id');
  //   // });
  //
  //   this.notaryService.getHistoryDetails(searchType).subscribe(
  //     (result: NotaryRegistrationHistoryDto[]) => {
  //       this.dataSource.data = result;
  //     },
  //     error1 => {
  //       console.log(error1);
  //     }
  //   )
  // }

}
