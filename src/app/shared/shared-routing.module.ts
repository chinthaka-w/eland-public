import { OnlineMethodComponent } from './components/payment/online-method/online-method.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from '../public-portal/home/home.component';
import { VerificationComponent } from './components/verification/verification.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentMethodComponent } from './components/payment/payment-method/payment-method.component';
import {ChangeJudicialComponent} from '../public-portal/dashboard/change-judicial/change-judicial.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "verification",
    component: VerificationComponent
  },
  {
    path: "payment",
    component: PaymentComponent,
  },
  {
    path: "payment-method",
    component: PaymentMethodComponent,
  },
  {
    path: 'payment-result/:paymentId/:url/:workflowStageCode/:userType/:userId',
    component: OnlineMethodComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule {}
