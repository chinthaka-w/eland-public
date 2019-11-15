import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileEditComponent } from './dashboard/profile/profile-edit/profile-edit.component';
import { AddPublicUserComponent } from './public-user-registration/add-public-user/add-public-user.component';
import {ChangeJudicialComponent} from './dashboard/change-judicial/change-judicial.component';


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
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: 'edit-profile',
    component: ProfileEditComponent
  },
  {
    path: "user-registration",
    component: AddPublicUserComponent
  },
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
