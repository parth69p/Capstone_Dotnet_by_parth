import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profileImage: [null] // not required
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    try {
      const formData = new FormData();
      formData.append('username', this.registerForm.get('username')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }
      console.log(formData);
      const response = await this.authService.register(formData);
      console.log('Registration success:', response);

      this.successMessage = 'Registration successful! Redirecting to login...';

      // Navigate to login after a short delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration failed', error);
      this.errorMessage =
        error?.response?.data || 'Registration failed. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
