// // src/app/services/api.service.ts
// import { Injectable } from '@angular/core';
// import {HttpClient, HttpHeaders} from '@angular/common/http';
// import { Observable } from 'rxjs';
// import {response} from 'express';  // Import Observable here
// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   apiUrl = 'http://localhost:3000/api/auth';
//
//   constructor(private http: HttpClient) { }
//
//   getUsers(): Observable<any> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
//     return this.http.get(`${this.apiUrl}/users`, { headers });
//   }
//   registerUser(user: { username: string, password: string, role: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, user);
//   }
//   login(credentials: { username: string; password: string }): Observable<any> {
//     // localStorage.setItem('token', response.token);
//     return this.http.post(`${this.apiUrl}/login`, credentials);
//   }
//   private getToken(): string {
//     return localStorage.getItem('token') || '';
//   }
//   private getAuthHeaders() {
//     const token = localStorage.getItem('token');
//     return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
//   }
//   getFiles(): Observable<any> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
//     return this.http.get('http://localhost:3000/files', { headers });
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = 'http://localhost:3000/api/auth'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Login method to authenticate user
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Method to get the token stored in localStorage
  getToken(): string {
    return localStorage.getItem('token') || '';
  }
  registerUser(user: { username: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  // Example method to fetch users (secured route)
  getUsers(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
}
