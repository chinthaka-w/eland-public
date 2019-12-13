import {Component, Input, OnInit} from '@angular/core';
import {NotaryRegistrationHistoryDto} from '../../../../shared/dto/notary-registration-history.dto';
import {NewNotaryRequestsCategorySearchDto} from '../../../../shared/dto/new-notary-requests-category-search.dto';
import {NewNotaryDataVarificationService} from '../../../../shared/service/new-notary-data-varification.service';
import {RequestSearchDetailDTO} from "../../../../shared/dto/request-search.dto";

@Component({
  selector: 'app-notary-remark',
  templateUrl: './notary-remark.component.html',
  styleUrls: ['./notary-remark.component.css']
})
export class NotaryRemarkComponent implements OnInit {
  @Input() requestRemarks: RequestSearchDetailDTO;
  @Input() workflow: string;
  @Input() id: number;
  notaryRequestHistory: NotaryRegistrationHistoryDto[] = [];
  constructor(private notaryService: NewNotaryDataVarificationService) { }

  ngOnInit() {
    this.getHistoryDetails();
  }

  getHistoryDetails() {
    let searchType: NewNotaryRequestsCategorySearchDto = new NewNotaryRequestsCategorySearchDto(this.requestRemarks.requestId,this.requestRemarks.workflow);

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
