import { Component, OnInit } from '@angular/core';
import {NewNotaryRequestsCategorySearchDto} from "../../../../../shared/dto/new-notary-requests-category-search.dto";
import {NotaryRegistrationHistoryDto} from "../../../../../shared/dto/notary-registration-history.dto";
import {ActivatedRoute} from "@angular/router";
import {NewNotaryDataVarificationService} from "../../../../../shared/service/new-notary-data-varification.service";

@Component({
  selector: 'app-remrk-table',
  templateUrl: './remrk-table.component.html',
  styleUrls: ['./remrk-table.component.css']
})
export class RemrkTableComponent implements OnInit {
  notaryRequestHistory: NotaryRegistrationHistoryDto[] = [];

  constructor(private notaryService: NewNotaryDataVarificationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getHistoryDetails();
  }

  getHistoryDetails(){
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(1,"1");
    // this.route.paramMap.subscribe(params =>{
    //   searchType.requestID = params.get('id');
    // });

    this.notaryService.getHistoryDetails(searchType).subscribe(
      (result: NotaryRegistrationHistoryDto[]) => {
        this.notaryRequestHistory = result;
      },
      error1 => {
        console.log(error1);
      }
    )
  }

}
