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
import {NotaryService} from './shared/service/notary-service';
import {HttpClient} from '@angular/common/http';
import {GnDivisionService} from './shared/service/gn-division.service';
import {DsDivisionService} from './shared/service/ds-division.service';
import {LandRegistryService} from './shared/service/land-registry.service';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { GridComponent } from './grid/grid.component';
import {JudicialZoneService} from './shared/service/judicial-zone.service';
import {BankService} from './shared/service/bank.service';
import {BankBranchService} from './shared/service/bank-branch.service';
import {PaymentService} from "./shared/service/payment.service";
import {ParameterService} from "./shared/service/parameter.service";
import {TokenStorageService} from "./shared/auth/token-storage.service";

@NgModule({
  declarations: [AppComponent, GridComponent],
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

    CommonModule,
    SharedModule,
    PublicPortalModule,
    HttpModule,
    HttpClientModule,
  ],
  providers: [MatDatepickerModule,
    HttpClient,
    NotaryService,
    GnDivisionService,
    DsDivisionService,
    LandRegistryService,
    JudicialZoneService,
    BankService,
    BankBranchService,
    PaymentService,
    ParameterService,
    TokenStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
