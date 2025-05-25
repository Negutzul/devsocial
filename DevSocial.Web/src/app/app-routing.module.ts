import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  { 
    path: 'signup', 
    component: SignupComponent,
    canActivate: [NoAuthGuard]
  },
  { 
    path: '', 
    redirectTo: 'feed',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  { 
    path: 'feed',
    loadChildren: () => import('./components/feed/feed.module').then(m => m.FeedModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 