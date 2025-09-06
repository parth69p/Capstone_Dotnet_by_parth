import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin-service';

@Component({
  selector: 'app-doctor-management',
  templateUrl: './doctor-management-component.html',
  styleUrls: ['./doctor-management-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DoctorManagementComponent implements OnInit {
  doctors: any[] = [];
  specializations: any[] = [];

  // For form binding
  doctorForm: any = {
    id: 0,
    name: '',
    city: '',
    specializationId: 0,
    rating: 4.2,
    profileImage: null
  };

  isEditing: boolean = false;

  constructor(private adminService: AdminService) {}

  async ngOnInit() {
    await this.loadDoctors();
    await this.loadSpecializations();
  }

  // Load doctors
  async loadDoctors() {
    this.doctors = await this.adminService.getAllDoctors();
  }

  // Load specializations (from backend)
  async loadSpecializations() {
    try {
      this.specializations = await this.adminService.getAllSpecializations();
      // console.log("Specializations loaded:", this.specializations);
    } catch (error) {
      console.error("Error loading specializations:", error);
    }
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.doctorForm.profileImage = event.target.files[0];
  }

  // Submit form (Add or Update)
  async saveDoctor() {
    const formData = new FormData();
    formData.append('name', this.doctorForm.name);
    formData.append('city', this.doctorForm.city);
    formData.append('specializationId', this.doctorForm.specializationId.toString());
    formData.append('rating', this.doctorForm.rating.toString());

    if (this.doctorForm.profileImage) {
      formData.append('profileImage', this.doctorForm.profileImage);
    }

    if (this.isEditing) {
      await this.adminService.updateDoctor(this.doctorForm.id, formData);
      alert('Doctor updated successfully');
    } else {
      await this.adminService.createDoctor(formData);
      alert('Doctor created successfully');
    }

    this.resetForm();
    await this.loadDoctors();
  }

  // Edit doctor
  editDoctor(doctor: any) {
    this.isEditing = true;
    this.doctorForm = {
      id: doctor.id,
      name: doctor.name,
      city: doctor.city,
      specializationId: doctor.specializationId,
      rating: doctor.rating,
      profileImage: null
    };
  }

  // Delete doctor
  async deleteDoctor(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      await this.adminService.deleteDoctor(id);
      alert('Doctor deleted successfully');
      await this.loadDoctors();
    }
  }

  // Reset form
  resetForm() {
    this.isEditing = false;
    this.doctorForm = {
      id: 0,
      name: '',
      city: '',
      specializationId: 0,
      rating: 4.2,
      profileImage: null
    };
  }
}
