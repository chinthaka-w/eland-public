import { RequestForCorrectionViewComponent } from './request-for-correction/request-for-correction-view/request-for-correction-view.component';
import { LanguageChangeViewComponent } from './dashboard/language-change/language-change-view/language-change-view.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddNotaryComponent} from './notary-registration/add-notary/add-notary.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileEditComponent} from './dashboard/profile/profile-edit/profile-edit.component';
import {AddPublicUserComponent} from './public-user-registration/add-public-user/add-public-user.component';
import {ChangeJudicialComponent} from './dashboard/change-judicial/change-judicial.component';
import {RequestForCorrectionComponent} from './request-for-correction/request-for-correction.component';
import { PublicProfileEditComponent } from './dashboard/profile/public-profile-edit/public-profile-edit.component';
import { SearchDocumentComponent } from './dashboard/search-document/search-document.component';
import { ExtractComponent } from './dashboard/extract/extract.component';
import { RequestsComponent } from './dashboard/requests/requests.component';
import { ChangeTheNameComponent } from './dashboard/change-the-name/change-the-name.component';
import { LanguageChangeComponent } from './dashboard/language-change/language-change.component';
import { LeaveRequestComponent } from './dashboard/leave-request/leave-request.component';
import { ResignationComponent } from './dashboard/resignation/resignation.component';
import { ApplicationsComponent } from './dashboard/applications/applications.component';

import {ViewNotaryComponent} from './dashboard/view-notary/view-notary.component';
import {PaymentComponent} from '../shared/components/payment/payment.component';
import {ChangeJudicialRequestListComponent} from '../shared/components/request-list/change-judicial-request-list.component';
import {JudicialChangeRequestViewComponent} from './dashboard/change-judicial/judicial-change-request-view/judicial-change-request-view.component';
import {ExtractViewComponent} from './dashboard/extract/extract-view/extract-view.component';
import {SearchDocumentViewComponent} from './dashboard/search-document/search-document-view/search-document-view.component';
import {ViewCitizenComponent} from './dashboard/view-citizen/view-citizen.component';
import {ChangeLandRegistryComponent} from './dashboard/change-land-registry/change-land-registry.component';
import {ChangeLandRegistryRequestViewComponent} from './dashboard/change-land-registry/change-land-registry-request-view/change-land-registry-request-view.component';
import {NotaryRequestViewComponent} from './dashboard/notary-request-view/notary-request-view.component';
import {NameChangeRequestViewComponent} from './dashboard/change-the-name/name-change-request-view/name-change-request-view.component';
import {AuthGuard} from '../shared/auth/auth.guard';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'notary-registration',
    component: AddNotaryComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-registration',
    component: AddPublicUserComponent,
  },
  {
    path: 'change-judicial',
    component: ChangeJudicialComponent,
    canActivate: [AuthGuard],
  },
{

  path: 'edit-public-profile',
  component: PublicProfileEditComponent,
  canActivate: [AuthGuard],

},
  {
    path: 'search-document',
    component: SearchDocumentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search-document-view/:workflow/:id',
    component: SearchDocumentViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'extract',
    component: ExtractComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'extract-view/:workflow/:id',
    component: ExtractViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-the-name',
    component: ChangeTheNameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'language-change',
    component: LanguageChangeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'language-change-view/:workflowStage/:id',
    component: LanguageChangeViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leave-request/:id',
    component: LeaveRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resignation/:id',
    component: ResignationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'applications',
    component: ApplicationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-notary',
    component: ViewNotaryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-citizen/:status',
    component: ViewCitizenComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notary-payment',
    component: PaymentComponent,
    canActivate: [AuthGuard],
  }
  ,
  {
    path: 'requests/:flag',
    component: ChangeJudicialRequestListComponent,
    canActivate: [AuthGuard],
  }
  ,
  {
    path: 'change-judicial-request-view/:workflow/:id',
    component: JudicialChangeRequestViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-name-request-view/:workflow/:workflowStage/:id',
    component: NameChangeRequestViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'request-for-correction',
    component: RequestForCorrectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-registry',
    component: ChangeLandRegistryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-land-registry-view/:workflow/:id',
    component: ChangeLandRegistryRequestViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'request-for-correction/:workflowStage/:id',
    component: RequestForCorrectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notary-requests/:workflow',
    component: NotaryRequestViewComponent,
    canActivate: [AuthGuard],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPortalRoutingModule {
}
