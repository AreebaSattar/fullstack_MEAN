import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Added pathMatch: 'full'
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {path:'admin-dashboard',component: AdminDashboardComponent},
];
