import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from './shared/shared.module';
import { PublicPortalModule } from './public-portal/public-portal.module';
import { MatIconModule } from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {NotaryService} from './public-portal/notary-registration/notary-service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {GnDivisionService} from "./public-portal/notary-registration/gn-division-service";
import {DsDivisionService} from "./public-portal/notary-registration/ds-division-service";
import {LandRegistryService} from "./public-portal/notary-registration/land-registry-service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,

    SharedModule,
    PublicPortalModule
  ],
  providers: [MatDatepickerModule,
    HttpClient,
    NotaryService,
   GnDivisionService,
   DsDivisionService,
   LandRegistryService],
  bootstrap: [AppComponent]
})
export class AppModule {}
