// import { Component } from '@angular/core';
// import { ApiService } from '../services/api.service';
// import { Router } from '@angular/router';
// import {FormsModule} from '@angular/forms';
//
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   standalone: true,
//   imports: [
//     FormsModule
//   ],
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   credentials = {
//     username: '',
//     password: ''
//   };
//
//   constructor(private apiService: ApiService, private router: Router) {}
//
//   // Method to handle login
//   login(): void {
//     this.apiService.login(this.credentials).subscribe({
//       next: (response) => {
//         // Save the token to localStorage
//         localStorage.setItem('token', response.token);
//
//
//         // Redirect to the admin dashboard or other page after login
//         this.router.navigate(['/home']);
//       },
//       error: (error) => {
//         console.error('Login failed:', error);
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule
  ],
  standalone: true
})
export class LoginComponent {
  credentials = {
    username: '',
    password: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  // Method to handle login
  login(): void {
    this.apiService.login(this.credentials).subscribe({
      next: (response) => {
        // Save the token in localStorage if login is successful
        console.log('User LoggedIn successfully:', response);
        localStorage.setItem('token', response.token);

        // Redirect user to their dashboard (or another page)
        this.router.navigate(['/home']); // Adjust this to your desired route
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Invalid credentials. Please try again.');
      },
    });
  }
}

