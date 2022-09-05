import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {AuthGuard} from './shared/services/AuthGuard';
const routes: Routes = [
  {
      path: '',
      loadChildren: () => import('./layout/layout.module').then(mod => mod.LayoutModule),
      canActivate: [ AuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
