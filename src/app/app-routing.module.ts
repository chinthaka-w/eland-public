import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { 
    path: "", 
    redirectTo: "home",
    pathMatch: "full" 
  },
  // { 
  //   path: "**", 
  //   redirectTo: "home",
  //   pathMatch: "full" 
  // },
  {
    path: "",
    loadChildren: ()=>import('./shared/shared.module').then(m => m.SharedModule)
  },
  {
    path: "",
    loadChildren: ()=>import('./public-portal/public-portal.module').then(m => m.PublicPortalModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
