import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotaryRegistrationHistoryDto} from "../../../../shared/dto/notary-registration-history.dto";
import {MatTableDataSource} from "@angular/material/table";
import {NewNotaryDataVarificationService} from "../../../../shared/service/new-notary-data-varification.service";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryRequestsCategorySearchDto} from "../../../../shared/dto/new-notary-requests-category-search.dto";

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

  notaryRequestHistory: NotaryRegistrationHistoryDto[] = [];

  displayedColumns: string[] = ['Workflow Stage', 'Remark', 'Created Time', 'Created User'];
  dataSource = new MatTableDataSource<NotaryRegistrationHistoryDto>(this.notaryRequestHistory);


  constructor(private notaryService: NewNotaryDataVarificationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // this.getHistoryDetails();
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
