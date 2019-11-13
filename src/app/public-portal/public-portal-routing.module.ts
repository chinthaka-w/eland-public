import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './notary-registration/verification/verification.component';
import { PaymentComponent } from './notary-registration/payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileEditComponent } from './dashboard/profile/profile-edit/profile-edit.component';
import {ChangeJudicialComponent} from './dashboard/change-judicial/change-judicial.component';
import { PaymentMethodComponent } from './notary-registration/payment/payment-method/payment-method.component';


const routes: Routes = [
  {
    path: 'notary-registration',
    component: AddNotaryComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'verification',
    component: VerificationComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: 'payment-method',
    component: PaymentMethodComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'edit-profile',
    component: ProfileEditComponent
  }
  ,
  {
    path: 'change-judicial',
    component: ChangeJudicialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPortalRoutingModule { }
