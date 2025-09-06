import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  username: string;
  role: string;
  profileImagePath?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management-component.html',
  styleUrls: ['./user-management-component.css'],
  imports: [FormsModule, CommonModule],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedFile: File | null = null;
  selectedUser: User | null = null; // For editing
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  userForm = {
    username: '',
    password: '',
    role: 'User',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService
      .getAllUsers()
      .then((res) => (this.users = res))
      .catch((err) => console.error(err))
      .finally(() => (this.loading = false));
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async createUser(form: NgForm) {
    if (!form.valid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formData = new FormData();
      formData.append('username', this.userForm.username);
      formData.append('password', this.userForm.password);
      formData.append('role', this.userForm.role);
      if (this.selectedFile) formData.append('profileImage', this.selectedFile);

      const res = await this.adminService.createUser(formData);
      this.successMessage = res.message || 'User created successfully!';
      this.userForm = { username: '', password: '', role: 'User' };
      this.selectedFile = null;
      form.resetForm({ role: 'User' });
      this.loadUsers();
    } catch (err: any) {
      this.errorMessage = err.response?.data || 'Failed to create user.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  editUser(user: User) {
    this.selectedUser = { ...user }; // Clone to avoid direct binding
    this.selectedFile = null;
  }
async updateUser(form: NgForm) {
  if (!this.selectedUser) return;
  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  try {
    const formData = new FormData();
    formData.append('username', this.selectedUser.username);
    formData.append('role', this.selectedUser.role);
    if (this.selectedFile) formData.append('profileImage', this.selectedFile);

    const res = await this.adminService.updateUser(this.selectedUser.id, formData);

    this.successMessage = res.message || 'User updated successfully!';
    this.selectedUser = null;
    this.selectedFile = null;
    form.resetForm({ role: 'User' }); // Reset role to default
    this.loadUsers();
  } catch (err: any) {
    this.errorMessage = err.response?.data?.message || 'Failed to update user.';
    console.error(err);
  } finally {
    this.loading = false;
  }
}


  cancelEdit() {
    this.selectedUser = null;
    this.selectedFile = null;
  }

  async deleteUser(userId: number | undefined) {
    if (!userId) {
      console.error('Invalid user id');
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await this.adminService.deleteUser(userId);
      this.loadUsers();
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Failed to delete user.';
    }
  }
}
