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
import { AuthGuard } from '../shared/auth/auth-guard';
import {ChangeLandRegistryComponent} from './dashboard/change-land-registry/change-land-registry.component';
import {ChangeLandRegistryRequestViewComponent} from './dashboard/change-land-registry/change-land-registry-request-view/change-land-registry-request-view.component';
import {NotaryRequestViewComponent} from './dashboard/notary-request-view/notary-request-view.component';

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
    component: DashboardComponent,
    canActivate: [AuthGuard]
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
    path: 'search-document-view/:workflow/:id',
    component: SearchDocumentViewComponent
  },
  {
    path: 'extract',
    component: ExtractComponent
  },
  {
    path: 'extract-view/:workflow/:id',
    component: ExtractViewComponent
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
    path: 'language-change-view/:workflowStage/:id',
    component: LanguageChangeViewComponent
  },
  {
    path: 'leave-request/:id',
    component: LeaveRequestComponent
  },
  {
    path: 'resignation/:id',
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
    path: 'requests/:flag',
    component: ChangeJudicialRequestListComponent
  }
  ,
  {
    path: 'change-judicial-request-view/:workflow/:id',
    component: JudicialChangeRequestViewComponent
  },
  {
    path: 'change-name-request-view/:workflow/:workflowStage/:id',
    component: NameChangeRequestViewComponent
  },
  {
    path: 'request-for-correction',
    component: RequestForCorrectionComponent
  },
  {
    path: 'change-registry',
    component: ChangeLandRegistryComponent
  },
  {
    path: 'change-land-registry-view/:workflow/:id',
    component: ChangeLandRegistryRequestViewComponent
  },
  {
    path: 'request-for-correction',
    component: RequestForCorrectionComponent
  },
  {
    path: 'notary-requests/:workflow',
    component: NotaryRequestViewComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPortalRoutingModule {
}
