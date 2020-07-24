import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRippleModule, MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from './shared/shared.module';
import {PublicPortalModule} from './public-portal/public-portal.module';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {NotaryService} from './shared/service/notary-service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {GnDivisionService} from './shared/service/gn-division.service';
import {DsDivisionService} from './shared/service/ds-division.service';
import {LandRegistryService} from './shared/service/land-registry.service';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {GridComponent} from './grid/grid.component';
import {JudicialZoneService} from './shared/service/judicial-zone.service';
import {BankService} from './shared/service/bank.service';
import {BankBranchService} from './shared/service/bank-branch.service';
import {PaymentService} from './shared/service/payment.service';
import {CitizenService} from './shared/service/citizen.service';
import {NotaryResignationService} from './shared/service/notary-resignation.service';
import {NotaryLeaveRequestService} from './shared/service/notary-leave-request.service';
import {ParameterService} from './shared/service/parameter.service';
import {TokenStorageService} from './shared/auth/token-storage.service';
import {SupportingDocService} from './shared/service/supporting-doc.service';
import {NewNotaryDataVarificationService} from './shared/service/new-notary-data-varification.service';
import {RequestForCorrectionService} from './shared/service/request-for-correction.service';
import {ChangeNameService} from './shared/service/change-name.service';
import {MatCardModule, MatTableModule} from '@angular/material';
import {ImageViewerModule} from 'ngx-image-viewer';
import {NotaryRequestService} from './shared/service/notary-request.service';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthInterceptorService} from './shared/auth/auth-interceptor.service';
import {ErrorInterceptorService} from './shared/auth/error-interceptor.service';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

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
    MatCardModule,
    MatTableModule,
    ReactiveFormsModule,
    HttpClientModule,

    CommonModule,
    SharedModule,
    PublicPortalModule,
    HttpModule,
    HttpClientModule,
    ImageViewerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
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
    CitizenService,
    NotaryResignationService,
    NotaryLeaveRequestService,
    ParameterService,
    TokenStorageService,
    SupportingDocService,
    NewNotaryDataVarificationService,
    RequestForCorrectionService,
    ChangeNameService,
    NotaryRequestService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
