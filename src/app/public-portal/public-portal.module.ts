import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPortalRoutingModule } from './public-portal-routing.module';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { VerificationComponent } from './notary-registration/verification/verification.component';
import { PaymentComponent } from './notary-registration/payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";




@NgModule({
  declarations: [AddNotaryComponent,LoginComponent, VerificationComponent, PaymentComponent, DashboardComponent],
  imports: [
    CommonModule,
    PublicPortalRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFileUploadModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    LoginComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFileUploadModule
  ]
})
export class PublicPortalModule { }
