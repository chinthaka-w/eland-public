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
    FileUploadPopupComponent
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
    MatProgressSpinnerModule
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
    RemarkHistoryComponent
  ],
  entryComponents: [
    FileUploadPopupComponent
  ],
  providers: [
    AuthGuard
  ]
})
export class SharedModule {}
