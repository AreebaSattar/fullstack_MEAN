// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/auth';  // Your backend URL
  private fileUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  // Fetch all users (Admin-only operation)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Fetch all files (Admin-only operation)
  getAllFiles(): Observable<any> {
    return this.http.get(`${this.fileUrl}/files`);
  }

  // Delete a user (Admin-only operation)
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  // Delete a file (Admin-only operation)
  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.fileUrl}/files/${fileId}`);
  }
}
