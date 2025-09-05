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

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  constructor(private router: Router) {
    // Restore login state from localStorage on app start
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedRole) {
      this.isLoggedInSubject.next(true);
      this.roleSubject.next(storedRole);
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

      if (response.data && response.data.token) {
        // Save token and role
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);

        // Update subjects to notify subscribers
        this.isLoggedInSubject.next(true);
        this.roleSubject.next(response.data.role); // ✅ important
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
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
}
