import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eland-public';

  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'si', 'ta']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(){
  }
}
