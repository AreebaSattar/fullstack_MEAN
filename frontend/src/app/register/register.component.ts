import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import {FormsModule} from '@angular/forms';  // Import the ApiService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,

  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  role: string = 'User';  // Default role set to 'User'

  constructor(private apiService: ApiService) { }

  // On form submit
  onSubmit(): void {
    const user = {
      username: this.username,
      password: this.password,
      role: this.role
    };

    // Send registration data to backend via ApiService
    this.apiService.registerUser(user).subscribe(
      (response: any) => {
        console.log('User registered successfully:', response);
        // Optionally handle successful registration (redirect, success message, etc.)
      },
      (error: any) => {
        console.error('Error registering user:', error);
        // Handle error (show error message to user)
      }
    );
  }
}
