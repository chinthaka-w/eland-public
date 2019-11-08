import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';
import { LoginComponent } from './login/login.component';
import { VerificationComponent } from './notary-registration/verification/verification.component';
import { PaymentComponent } from './notary-registration/payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';


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
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPortalRoutingModule { }
