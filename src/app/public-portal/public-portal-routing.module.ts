import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';


const routes: Routes = [
  {
    path: "notary-registration",
    component: AddNotaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPortalRoutingModule { }
