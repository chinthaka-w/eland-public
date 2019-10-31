import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPortalRoutingModule } from './public-portal-routing.module';
import { AddNotaryComponent } from './notary-registration/add-notary/add-notary.component';



@NgModule({
  declarations: [AddNotaryComponent],
  imports: [
    CommonModule,
    PublicPortalRoutingModule
  ]
})
export class PublicPortalModule { }
