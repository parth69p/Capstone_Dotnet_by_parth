import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-specialization-management',
  imports: [FormsModule,CommonModule],
  templateUrl: './specialization-management-component.html',
  styleUrls: ['./specialization-management-component.css']
})
export class SpecializationManagementComponent implements OnInit {
  specializations: any[] = [];
  specializationForm: { id?: number; name: string } = { name: '' };
  isEditing = false;
  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSpecializations();
  }

  async loadSpecializations() {
    this.loading = true;
    try {
      this.specializations = await this.adminService.getAllSpecializations();
    } catch (error) {
      this.errorMessage = 'Failed to load specializations.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  editSpecialization(spec: any) {
    this.isEditing = true;
    this.specializationForm = { id: spec.specializationId, name: spec.specializationName };
  }

  resetForm() {
    this.isEditing = false;
    this.specializationForm = { name: '' };
  }

  async saveSpecialization() {
    try {
      if (this.isEditing && this.specializationForm.id) {
        await this.adminService.updateSpecialization(
          this.specializationForm.id,
          this.specializationForm.name
        );
      } else {
        await this.adminService.createSpecialization(this.specializationForm.name);
      }
      this.resetForm();
      this.loadSpecializations();
    } catch (error) {
      console.error('Error saving specialization:', error);
    }
  }

  async deleteSpecialization(id: number) {
    if (confirm('Are you sure you want to delete this specialization?')) {
      try {
        await this.adminService.deleteSpecialization(id);
        this.loadSpecializations();
      } catch (error) {
        console.error('Error deleting specialization:', error);
      }
    }
  }
}
