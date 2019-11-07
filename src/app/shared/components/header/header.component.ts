import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  status: boolean = false;
  dropdown: boolean = false;

  clickEvent(){
      this.status = !this.status;     
      this.dropdown=false;  
  }

  clickDropdown(){
    this.dropdown = !this.dropdown;    
    this.status=false;   
  }

  constructor() { }

  ngOnInit() {
  }

}
