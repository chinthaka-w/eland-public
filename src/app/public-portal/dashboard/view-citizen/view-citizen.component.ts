import { Component, OnInit } from '@angular/core';
import {CitizenService} from "../../../shared/service/citizen.service";
import {CitizenDTO} from "../../../shared/dto/citizen-dto";

@Component({
  selector: 'app-view-citizen',
  templateUrl: './view-citizen.component.html',
  styleUrls: ['./view-citizen.component.css']
})
export class ViewCitizenComponent implements OnInit {
  citizenDTO: CitizenDTO = new CitizenDTO();
  constructor(private citizenService: CitizenService) { }

  ngOnInit() {
  }

  onApplicationResponse(data: CitizenDTO) {
    this.citizenDTO = data;
    console.log("On main component:   ",this.citizenDTO);
  }

}
