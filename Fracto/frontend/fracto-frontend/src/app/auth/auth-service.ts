import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios'; // Import axios

// Create an axios instance for consistent configuration
const axiosInstance = axios.create({
  baseURL: 'https://localhost:5213/api/User' // Your backend URL
});

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // The state management part remains the same
  private readonly loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private readonly router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  
  //  * Registers a new user using axios.
  //  * @param userData The form data including username, password, role, and optional profile image.
  
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


  
  //  *? Logs in a user using axios and handles the JWT token.
  //  * @param credentials The user's username and password.

  async login(credentials: any): Promise<any> {
    try {
      const response = await axiosInstance.post<any>('/login', credentials);
      
      if (response.data && response.data.token) {
        // 1. Save the token and role to local storage.
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        
        // 2. Notify all subscribed components that the user is now logged in.
        this.loggedIn.next(true);
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Logs the user out by clearing client-side storage.
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Retrieves the stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Retrieves the stored user role.
   */
  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
}