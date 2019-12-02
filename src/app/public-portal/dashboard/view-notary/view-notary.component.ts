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
  @ViewChild(NotaryApplicationComponent, {static: false}) notaryApplicationComponent: NotaryApplicationComponent;
  public disabled: boolean = true;
  public notaryDetail: Notary;


  constructor(private newNotaryService: NotaryService) { }
  ngOnInit() {
  }

  tabClick(event){
    if( event.tab.textLabel === "Supporting Documents"){
      this.disabled = false;
    }
    if(event.tab.textLabel === 'Payment Info'){
     this.notaryApplicationComponent.saveNotaryDetails();
    }
  }

  onFormSubmit(){

  }

}
