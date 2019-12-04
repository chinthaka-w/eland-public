import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Notary} from "../../../shared/dto/notary.model";
import {NotaryService} from "../../../shared/service/notary-service";
import {NotaryApplicationComponent} from "./notary-application/notary-application.component";

@Component({
  selector: 'app-view-notary',
  templateUrl: './view-notary.component.html',
  styleUrls: ['./view-notary.component.css']
})
export class ViewNotaryComponent implements OnInit {
  Workflow: Workflow;
  public workflow: string = Workflow.NOTARY_REGISTRATION;
  public id: number = 1;
  @ViewChild(NotaryApplicationComponent, {static: false}) notaryApplicationComponent: NotaryApplicationComponent;
  public disabled: boolean = true;
  public disabledPayment: boolean = true;
  public notaryDetail: Notary;


  constructor(private newNotaryService: NotaryService) { }
  ngOnInit() {
  }

  tabClick(event){
    if( event.tab.textLabel === "Application"){
       this.disabled = false;
   //   this.disabledPayment = false;
    }
    if(event.tab.textLabel === "Payment Info"){
        this.disabled = false;
    }
    if(event.tab.textLabel === "Remark"){
       this.disabled = false;
    }
    if( event.tab.textLabel === "Supporting Documents"){
      this.disabled = true;
    }
  }

  onFormSubmit(){
    this.notaryApplicationComponent.saveNotaryDetails();
  }

}
