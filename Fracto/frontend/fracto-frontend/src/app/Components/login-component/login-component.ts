import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  loginUser() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }

    const loginData = { username: this.username, password: this.password };

    this.userService.login(loginData).subscribe({
      next: (res) => {
        console.log('Login response:', res); // for the testing pupose that token is received or not

        // Save token in localStorage
        localStorage.setItem('token', res.token);

        // Optionally store role
        localStorage.setItem('role', res.role);

        // Redirect to dashboard or home page
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.error || 'Login failed';
      }
    });
}
}
