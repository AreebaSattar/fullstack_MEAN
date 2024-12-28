// src/app/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import {ApiService} from '../services/api.service';
import {Router} from '@angular/router'; // Import the service

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];  // List of users
  files: any[] = [];  // List of files

  constructor(private adminService: AdminService,private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (!this.apiService.getToken()) {
      this.router.navigate(['/home']); // Redirect to login if no token is found
    }
    this.loadUsers();
    this.loadFiles();
  }

  // Fetch all users from the backend
  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (response) => {
        console.log(response);
        this.users = response;  // Assign the response data to the users array
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // Fetch all files from the backend
  loadFiles(): void {
    this.adminService.getAllFiles().subscribe(
      (response) => {
        this.files = response;  // Assign the response data to the files array
      },
      (error) => {
        console.error('Error fetching files:', error);
      }
    );
  }

  // Delete a user
  deleteUser(userId: string): void {
    this.adminService.deleteUser(userId).subscribe(
      (response) => {
        this.loadUsers();  // Reload users after deletion
        console.log('User deleted:', response);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  // Delete a file
  deleteFile(fileId: string): void {
    this.adminService.deleteFile(fileId).subscribe(
      (response) => {
        this.loadFiles();  // Reload files after deletion
        console.log('File deleted:', response);
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }
}
