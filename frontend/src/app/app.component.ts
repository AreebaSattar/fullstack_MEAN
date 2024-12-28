import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {ApiService} from './services/api.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AdminService} from './services/admin.service';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    HttpClientModule,
    LoginComponent,
    RegisterComponent,
    RouterLink,
    AdminDashboardComponent,
    CommonModule


  ],
  providers:[
    ApiService,
    AdminService,



  ],
  standalone: true
})
export class AppComponent {
  title = 'app';  // Define title used in your HTML
  constructor(private router: Router, private apiService: ApiService,private adminService: AdminService) {}


  fetchUsers(): void {
    this.apiService.getUsers().subscribe({next:(users) => console.log(users) });
  }

  navigatetoAdminDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Method to navigate to the register page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

}

