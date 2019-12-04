import {Component, Input, OnInit} from '@angular/core';
import {NotaryRegistrationHistoryDto} from '../../../../shared/dto/notary-registration-history.dto';
import {NewNotaryRequestsCategorySearchDto} from '../../../../shared/dto/new-notary-requests-category-search.dto';
import {NewNotaryDataVarificationService} from '../../../../shared/service/new-notary-data-varification.service';

@Component({
  selector: 'app-notary-remark',
  templateUrl: './notary-remark.component.html',
  styleUrls: ['./notary-remark.component.css']
})
export class NotaryRemarkComponent implements OnInit {
  @Input() workflow: string;
  @Input() id: number;
  notaryRequestHistory: NotaryRegistrationHistoryDto[] = [];
  constructor(private notaryService: NewNotaryDataVarificationService) { }

  ngOnInit() {
    this.getHistoryDetails();
  }

  getHistoryDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.id,"1", this.workflow);
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
