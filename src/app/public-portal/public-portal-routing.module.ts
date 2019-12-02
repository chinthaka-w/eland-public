import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileEditComponent } from './dashboard/profile/profile-edit/profile-edit.component';
import { AddPublicUserComponent } from './public-user-registration/add-public-user/add-public-user.component';
import {ChangeJudicialComponent} from './dashboard/change-judicial/change-judicial.component';
import { PublicProfileEditComponent } from './dashboard/profile/public-profile-edit/public-profile-edit.component';
import { SearchDocumentComponent } from './dashboard/search-document/search-document.component';
import { ExtractComponent } from './dashboard/extract/extract.component';
import { RequestsComponent } from './dashboard/requests/requests.component';
import { ChangeTheNameComponent } from './dashboard/change-the-name/change-the-name.component';
import { LanguageChangeComponent } from './dashboard/language-change/language-change.component';
import { LeaveRequestComponent } from './dashboard/leave-request/leave-request.component';
import { ResignationComponent } from './dashboard/resignation/resignation.component';
import { ApplicationsComponent } from './dashboard/applications/applications.component';
import {ViewNotaryComponent} from "./dashboard/view-notary/view-notary.component";
import {PaymentComponent} from "../shared/components/payment/payment.component";
import {ChangeJudicialRequestListComponent} from './dashboard/change-judicial/change-judicial-request-list/change-judicial-request-list.component';
import {ViewCitizenComponent} from "./dashboard/view-citizen/view-citizen.component";


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
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'edit-profile',
    component: ProfileEditComponent
  },
  {
    path: 'user-registration',
    component: AddPublicUserComponent
  },
  {
    path: 'change-judicial',
    component: ChangeJudicialComponent
  },
  {
    path: 'edit-public-profile',
    component: PublicProfileEditComponent
  },
  {
    path: 'search-document',
    component: SearchDocumentComponent
  },
  {
    path: 'extract',
    component: ExtractComponent
  },
  {
    path: 'requests',
    component: RequestsComponent
  },
  {
    path: 'change-the-name',
    component: ChangeTheNameComponent
  },
  {
    path: 'language-change',
    component: LanguageChangeComponent
  },
  {
    path: 'leave-request',
    component: LeaveRequestComponent
  },
  {
    path: 'resignation',
    component: ResignationComponent
  },
  {
    path: 'applications',
    component: ApplicationsComponent
  },
  {
    path: 'view-notary',
    component: ViewNotaryComponent
  },
  {
    path: 'view-citizen',
    component: ViewCitizenComponent
  },
  {
    path: 'notary-payment',
    component: PaymentComponent
  }
  ,
  {
    path: 'change-judicial-request-list',
    component: ChangeJudicialRequestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPortalRoutingModule { }
