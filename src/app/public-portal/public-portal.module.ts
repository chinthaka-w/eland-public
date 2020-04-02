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

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileEditComponent } from './dashboard/profile/profile-edit/profile-edit.component';
import { ApplicationComponent } from './dashboard/profile/profile-edit/application/application.component';
import { PaymentInfoComponent } from './dashboard/profile/profile-edit/payment-info/payment-info.component';
import { RemarkComponent } from './dashboard/profile/profile-edit/remark/remark.component';
import { NotaryClerkComponent } from './dashboard/profile/profile-edit/notary-clerk/notary-clerk.component';
import { HistoryComponent } from './dashboard/profile/profile-edit/history/history.component';
import { AddPublicUserComponent } from './public-user-registration/add-public-user/add-public-user.component';
import { ChangeJudicialComponent } from './dashboard/change-judicial/change-judicial.component';
import {HttpModule} from '@angular/http';
import { RequestForCorrectionComponent } from './request-for-correction/request-for-correction.component';
import { PublicProfileEditComponent } from './dashboard/profile/public-profile-edit/public-profile-edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import { NotaryDetailsComponent } from './dashboard/profile/public-profile-edit/notary-details/notary-details.component';
import { AccountDetailsComponent } from './dashboard/profile/public-profile-edit/account-details/account-details.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { SearchDocumentComponent } from './dashboard/search-document/search-document.component';
import { ExtractComponent } from './dashboard/extract/extract.component';
import { RequestsComponent } from './dashboard/requests/requests.component';
import { ChangeTheNameComponent } from './dashboard/change-the-name/change-the-name.component';
import { LanguageChangeComponent } from './dashboard/language-change/language-change.component';
import { LeaveRequestComponent } from './dashboard/leave-request/leave-request.component';
import { ResignationComponent } from './dashboard/resignation/resignation.component';
import { ApplicationsComponent } from './dashboard/applications/applications.component';
import { RequestViewComponent } from './dashboard/requests/request-view/request-view.component';
import {SharedModule} from "../shared/shared.module";
import { ViewNotaryComponent } from './dashboard/view-notary/view-notary.component';
import { NotaryApplicationComponent } from './dashboard/view-notary/notary-application/notary-application.component';
import { NotaryPaymentInfoComponent } from './dashboard/view-notary/notary-payment-info/notary-payment-info.component';
import { NotaryRemarkComponent } from './dashboard/view-notary/notary-remark/notary-remark.component';
import { DsGnDivisionTableComponent } from './dashboard/view-notary/notary-application/ds-gn-division-table/ds-gn-division-table.component';
import { PaymentTableComponent } from './dashboard/view-notary/notary-payment-info/payment-table/payment-table.component';
import { RemrkTableComponent } from './dashboard/view-notary/notary-remark/remrk-table/remrk-table.component';
import { SupportingDocDetailComponent } from './dashboard/view-notary/supporting-doc-detail/supporting-doc-detail.component';
import {ImageViewerModule} from "ngx-image-viewer";
import {ChangeJudicialRequestListComponent} from '../shared/components/request-list/change-judicial-request-list.component';
import {
  MatBadgeModule,
  MatBottomSheetModule,
  MatCardModule,
  MatChipsModule,
  MatDividerModule, MatListModule,
  MatNativeDateModule,
  MatPaginatorModule
} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { JudicialChangeRequestViewComponent } from './dashboard/change-judicial/judicial-change-request-view/judicial-change-request-view.component';
import { RequestDataComponent } from './dashboard/change-judicial/judicial-change-request-view/request-data/request-data.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ViewCitizenComponent } from './dashboard/view-citizen/view-citizen.component';
import { CitizenApplicationComponent } from './dashboard/view-citizen/citizen-application/citizen-application.component';
import { CitizenPaymentInfoComponent } from './dashboard/view-citizen/citizen-payment-info/citizen-payment-info.component';
import { CitizenRemarkComponent } from './dashboard/view-citizen/citizen-remark/citizen-remark.component';
import { CitizenSupportingDocDetailsComponent } from './dashboard/view-citizen/citizen-supporting-doc-details/citizen-supporting-doc-details.component';
import { SearchDocumentViewComponent } from './dashboard/search-document/search-document-view/search-document-view.component';
import { ExtractViewComponent } from './dashboard/extract/extract-view/extract-view.component';
import { SearchDocumentApplicationComponent } from './dashboard/search-document/search-document-view/search-document-application/search-document-application.component';
import { ExtractApplicationComponent } from './dashboard/extract/extract-view/extract-application/extract-application.component';
import { LanguageChangeViewComponent } from './dashboard/language-change/language-change-view/language-change-view.component';
import { LangChangeApplicationComponent } from './dashboard/language-change/language-change-view/lang-change-application/lang-change-application.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { NameChangeRequestViewComponent } from './dashboard/change-the-name/name-change-request-view/name-change-request-view.component';
import { NameChangeRequestDataComponent } from './dashboard/change-the-name/name-change-request-view/name-change-request-data/name-change-request-data.component';
import { RequestForCorrectionViewComponent } from './request-for-correction/request-for-correction-view/request-for-correction-view.component';
import { CorrectionApplicationComponent } from './request-for-correction/correction-application/correction-application.component';
import { NewCorrectionRequestComponent } from './request-for-correction/new-correction-request/new-correction-request.component';
import { ChangeLandRegistryComponent } from './dashboard/change-land-registry/change-land-registry.component';
import { ChangeLandRegistryRequestViewComponent } from './dashboard/change-land-registry/change-land-registry-request-view/change-land-registry-request-view.component';
import { SearchDocumentResultComponent } from './dashboard/search-document/search-document-view/search-document-application/search-document-result/search-document-result.component';


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
    AddPublicUserComponent,
    ChangeJudicialComponent,
    PublicProfileEditComponent,
    NotaryDetailsComponent,
    AccountDetailsComponent,
    SearchDocumentComponent,
    ExtractComponent,
    RequestsComponent,
    ChangeTheNameComponent,
    LanguageChangeComponent,
    LeaveRequestComponent,
    ResignationComponent,
    ApplicationsComponent,
    RequestViewComponent,
    RequestForCorrectionComponent,
    RequestViewComponent,
    ViewNotaryComponent,
    NotaryApplicationComponent,
    NotaryPaymentInfoComponent,
    NotaryRemarkComponent,
    DsGnDivisionTableComponent,
    PaymentTableComponent,
    RemrkTableComponent,
    SupportingDocDetailComponent,
    ViewCitizenComponent,
    CitizenApplicationComponent,
    CitizenPaymentInfoComponent,
    CitizenRemarkComponent,
    CitizenSupportingDocDetailsComponent,
    JudicialChangeRequestViewComponent,
    RequestDataComponent,
    SearchDocumentViewComponent,
    ExtractViewComponent,
    SearchDocumentApplicationComponent,
    ExtractApplicationComponent,
    LanguageChangeViewComponent,
    RequestForCorrectionComponent,
    LangChangeApplicationComponent,
    RequestForCorrectionComponent,
    NameChangeRequestViewComponent,
    NameChangeRequestDataComponent,
<<<<<<< HEAD
    SearchDocumentResultComponent,
    NameChangeRequestDataComponent,
=======
    RequestForCorrectionViewComponent,
    CorrectionApplicationComponent,
    NewCorrectionRequestComponent,
>>>>>>> ac6bc6f3ef4c8c0bb4450f54c7f7ee36e27101ac
    ChangeLandRegistryComponent,
    ChangeLandRegistryRequestViewComponent,
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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatDividerModule,
    MatBadgeModule,
    MatChipsModule,
    HttpModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SharedModule,
    MatPaginatorModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    ImageViewerModule,
    MatSlideToggleModule,
    MatInputModule,
    MatListModule
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
    MatTableModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatCardModule,
    MatBottomSheetModule,
    MatTableModule,
    MatBadgeModule,
    MatChipsModule
  ],
  entryComponents:[
    RequestViewComponent,
    PublicProfileEditComponent,
    SearchDocumentResultComponent
  ],
  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    } as RecaptchaSettings,
  }]
})
export class PublicPortalModule { }
