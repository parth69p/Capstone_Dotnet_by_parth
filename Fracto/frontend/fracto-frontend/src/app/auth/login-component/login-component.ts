import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule,RouterLink],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;  // Use ! to assure Angular it's initialized
  errorMessage: string = '';
  isSubmitting: boolean = false; // Optional: disable button during login

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize reactive form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm || this.loginForm.invalid) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    try {
      const credentials = this.loginForm.value;
      const response = await this.authService.login(credentials);
      console.log('Login successful', response);

      // Navigate based on role
      const role = this.authService.getRole();
      if (role === 'Admin') {
        this.router.navigate(['/admin-dashboard-component']);
      } else {
        this.router.navigate(['/doctor-search']);
      }
    } catch (error) {
      console.error('Login failed', error);
      this.errorMessage = 'Invalid username or password. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
