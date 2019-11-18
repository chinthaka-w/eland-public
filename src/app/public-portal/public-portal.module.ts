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
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

import { DashboardComponent } from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileEditComponent } from './dashboard/profile/profile-edit/profile-edit.component';
import { ApplicationComponent } from './dashboard/profile/profile-edit/application/application.component';
import { PaymentInfoComponent } from './dashboard/profile/profile-edit/payment-info/payment-info.component';
import { RemarkComponent } from './dashboard/profile/profile-edit/remark/remark.component';
import { NotaryClerkComponent } from './dashboard/profile/profile-edit/notary-clerk/notary-clerk.component';
import { HistoryComponent } from './dashboard/profile/profile-edit/history/history.component';
import { PublicRegistrationComponent } from './public-registration/public-registration.component';
import { AddUserComponent } from './public-registration/add-user/add-user.component';
import { ChangeJudicialComponent } from './dashboard/change-judicial/change-judicial.component';
import {HttpModule} from '@angular/http';
import { PublicProfileEditComponent } from './dashboard/profile/public-profile-edit/public-profile-edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import { NotaryDetailsComponent } from './dashboard/profile/public-profile-edit/notary-details/notary-details.component';
import { AccountDetailsComponent } from './dashboard/profile/public-profile-edit/account-details/account-details.component';
import { SearchDocumentComponent } from './dashboard/search-document/search-document.component';
import { ExtractComponent } from './dashboard/extract/extract.component';
import { RequestsComponent } from './dashboard/requests/requests.component';




@NgModule({
  declarations: [
    AddNotaryComponent,
    LoginComponent, 
    DashboardComponent, 
    ProfileEditComponent, 
    ApplicationComponent, 
    PaymentInfoComponent, 
    RemarkComponent, 
    NotaryClerkComponent, 
    HistoryComponent, 
    PublicRegistrationComponent, 
    AddUserComponent,
    ChangeJudicialComponent,
    PublicProfileEditComponent,
    NotaryDetailsComponent,
    AccountDetailsComponent,
    SearchDocumentComponent,
    ExtractComponent,
    RequestsComponent
  ],
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
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    HttpModule,
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
    MatFileUploadModule,
    MatTabsModule,
    MatDialogModule,
    MatTableModule
  ],
  entryComponents:[
    
  ]
})
export class PublicPortalModule { }
