import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './components/content/content.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';
import { HomeComponent } from '../public-portal/home/home.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VerificationComponent } from './components/verification/verification.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentMethodComponent } from './components/payment/payment-method/payment-method.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadInputComponent } from './components/file-upload-input/file-upload-input.component';
import { OnlineMethodComponent } from './components/payment/online-method/online-method.component';
import {ChangeJudicialRequestListComponent} from './components/request-list/change-judicial-request-list.component';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {MatPaginatorModule, MatProgressSpinnerModule} from '@angular/material';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from "@angular/material/card";
import {ImageViewerModule} from "ngx-image-viewer";
import { LastRemarkComponent } from './components/request-view/last-remark/last-remark.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { RemarkHistoryComponent } from './components/remark-history/remark-history.component';
import { FileUploadPopupComponent } from './components/file-upload-popup/file-upload-popup.component';
import { AuthGuard } from './auth/auth-guard';
import { DocPreviewComponent } from './components/doc-preview/doc-preview.component';
import { FolioViewComponent } from './components/folio-view/folio-view.component';
import { FolioHeaderComponent } from './components/sub-components/folio-header/folio-header.component';
import { GrantorComponent } from './components/sub-components/grantor/grantor.component';
import { GranteeComponent } from './components/sub-components/grantee/grantee.component';
import { TrusterComponent } from './components/sub-components/truster/truster.component';
import { TrusteeComponent } from './components/sub-components/trustee/trustee.component';
import { CoTrusterComponent } from './components/sub-components/co-truster/co-truster.component';
import { CoTrusteeComponent } from './components/sub-components/co-trustee/co-trustee.component';
import { OldTrusteeComponent } from './components/sub-components/old-trustee/old-trustee.component';
import { BeneficialComponent } from './components/sub-components/beneficial/beneficial.component';
import { BeneficiaryComponent } from './components/sub-components/beneficiary/beneficiary.component';
import { BoundaryComponent } from './components/sub-components/boundary/boundary.component';
import { CloseNoteComponent } from './components/sub-components/close-note/close-note.component';
import { CrossNoteComponent } from './components/sub-components/cross-note/cross-note.component';
import { ExtentComponent } from './components/sub-components/extent/extent.component';
import { ParticularComponent } from './components/sub-components/particular/particular.component';
import { PropertyComponent } from './components/sub-components/property/property.component';
import { RemarkComponent } from './components/sub-components/remark/remark.component';
import { UnitComponent } from './components/sub-components/unit/unit.component';
import { TransactionViewComponent } from './components/transaction-view/transaction-view.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ListTranslatePipe } from './pipe/list-translate.pipe';

@NgModule({
  declarations: [
    ContentComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    VerificationComponent,
    PaymentComponent,
    PaymentMethodComponent,
    FileUploadInputComponent,
    OnlineMethodComponent,
    ChangeJudicialRequestListComponent,
    LastRemarkComponent,
    PaymentHistoryComponent,
    RemarkHistoryComponent,
    FileUploadPopupComponent,
    DocPreviewComponent,
    FolioViewComponent,
    FolioHeaderComponent,
    GrantorComponent,
    GranteeComponent,
    TrusterComponent,
    TrusteeComponent,
    CoTrusterComponent,
    CoTrusteeComponent,
    OldTrusteeComponent,
    BeneficialComponent,
    BeneficiaryComponent,
    BoundaryComponent,
    CloseNoteComponent,
    CrossNoteComponent,
    ExtentComponent,
    ParticularComponent,
    PropertyComponent,
    RemarkComponent,
    UnitComponent,
    TransactionViewComponent,
    FileUploadPopupComponent,
    ListTranslatePipe
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatGridListModule,
    MatSelectModule,
    MatFileUploadModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    SatDatepickerModule,
    SatNativeDateModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatIconModule,
    ImageViewerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    TranslateModule
  ],
  exports: [
    ContentComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    VerificationComponent,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFileUploadModule,
    MatTabsModule,
    MatCardModule,
    PaymentComponent,
    PaymentMethodComponent,
    FileUploadInputComponent,
    LastRemarkComponent,
    PaymentHistoryComponent,
    RemarkHistoryComponent,
    TranslatePipe,
    ListTranslatePipe,
    DocPreviewComponent,
  ],
  providers: [
    AuthGuard,
  ],
  entryComponents: [
    FolioViewComponent,
    FileUploadPopupComponent
  ]
})
export class SharedModule {}
