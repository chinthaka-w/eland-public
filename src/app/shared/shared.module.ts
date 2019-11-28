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
import {MatCardModule} from "@angular/material/card";
import {ImageViewerModule} from "ngx-image-viewer";

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
    OnlineMethodComponent
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
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatIconModule,
    ImageViewerModule
  ],
  exports: [
    ContentComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    VerificationComponent,
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
    MatCardModule,
    PaymentComponent,
    PaymentMethodComponent,
    FileUploadInputComponent
  ]
})
export class SharedModule {}
