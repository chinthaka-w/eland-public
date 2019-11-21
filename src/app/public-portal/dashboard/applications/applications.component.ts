import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NewNotaryDataVarificationService} from "../../../shared/service/new-notary-data-varification.service";
import {NewNotaryRequestsCategorySearchDto} from "../../../shared/dto/new-notary-requests-category-search.dto";
import {NewNotaryViewDto} from "../../../shared/dto/new-notary-view.dto";
import {NewNotaryRegistrationRequest} from "../../../shared/dto/new-notary-registration-request.model";

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  @Output() response = new EventEmitter();
  public newNotary:NewNotaryRequestsCategorySearchDto;
  public newNotaryRegistrationRequests: NewNotaryRegistrationRequest[];
  public viewNotaryDetails: NewNotaryViewDto;
  public requestID: string;
  public type: string;
  public isNotaryDetails: boolean = false;
  public isApplicationDetails: boolean = true;

  constructor(private newNotaryDataVarificationService: NewNotaryDataVarificationService) { }

  ngOnInit() {
  }

  getNotaryDetails(): void{
    this.requestID = "1";
    this.type = "1";

    this.newNotary = new NewNotaryRequestsCategorySearchDto(1,"1");
    this.newNotaryDataVarificationService.getNotaryDetails(this.newNotary).subscribe(
      (res: NewNotaryViewDto) => {
        console.log(res);
        this.viewNotaryDetails = res;
        this.isNotaryDetails = true;
        this.isApplicationDetails = false;
        this.newNotaryDataVarificationService.getRemarkDetailsByNotary(this.viewNotaryDetails.nic).subscribe(
          (res: NewNotaryRegistrationRequest[]) => {
            this.newNotaryRegistrationRequests = res;
          }
        );
        this.newNotaryDataVarificationService.setNotaryDetails(this.viewNotaryDetails,this.newNotaryRegistrationRequests);
      }
    );
  }
}
