import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

// Axios instance for backend requests
const axiosInstance = axios.create({
  baseURL: 'https://localhost:5213/api/User' // Your backend URL
});

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private router: Router) {
    // Restore login state from localStorage on app start
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

   if (storedToken && storedRole) {
    this.isLoggedInSubject.next(true);
    this.roleSubject.next(storedRole);

    // ✅ missing line to restore username
    if (storedUserName && storedUserName !== 'undefined') {
      this.usernameSubject.next(storedUserName);
    }
  }
  }

  async register(userData: FormData): Promise<any> {
    try {
      const response = await axiosInstance.post('/register', userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data);
      throw error;
    }
  }

  async login(credentials: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>('/login', credentials);
 console.log('Login API Response:', response.data);
      if (response.data && response.data.token) {
        // Save token and role
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.username);

        // Update subjects to notify subscrib ers
        this.isLoggedInSubject.next(true);
        // setting user name for navbar
        this.setUsername(response.data.username);

        this.roleSubject.next(response.data.role);
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.usernameSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
    this.router.navigate(['/login']);
  }
  // =============================== Token and Role Getters ===========================
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  
  //=============================== for displaying name in navbar===========================


  setUsername(name: string): void {
    this.usernameSubject.next(name);
  }

getUserName(): string | null {
  return this.usernameSubject.value;
}
}
