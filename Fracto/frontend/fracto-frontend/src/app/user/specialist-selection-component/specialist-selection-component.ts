import { Component, OnInit } from '@angular/core';
import { DoctorService, DoctorDto, SpecializationDto } from '../doctor-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DoctorListComponent } from '../doctor-list-component/doctor-list-component';
@Component({
  selector: 'app-specialist-selection',
  imports: [FormsModule, CommonModule,DoctorListComponent],
  templateUrl: './specialist-selection-component.html',
  styleUrls: ['./specialist-selection-component.css']
})
export class SpecialistSelectionComponent implements OnInit {
  cities: string[] = [];
  specializations: SpecializationDto[] = [];
  selectedCity: string = '';
  selectedSpecializationId: number = 0;
  minRating: number = 0;

  doctors: DoctorDto[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit() {
    if (this.isTokenExpired()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCities();
    this.loadSpecializations();
    this.loadAllDoctors(); // Load all doctors on init
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return Date.now() / 1000 > exp;
    } catch {
      return true;
    }
  }

  loadCities() {
    this.doctorService.getCities()
      .then(res => { this.cities = res.data; })
      .catch(err => console.error(err));
  }

  loadSpecializations() {
    this.doctorService.getSpecializations()
      .then(res => { this.specializations = res.data; })
      .catch(err => console.error(err));
  }

  loadAllDoctors() {
    this.loading = true;
    this.errorMessage = '';

    this.doctorService.getAllDoctors() // Fetch all doctors
      .then(res => {
        this.doctors = res.data;
        if (this.doctors.length === 0) {
          this.errorMessage = 'No doctors available';
        }
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = 'Failed to load doctors';
      })
      .finally(() => this.loading = false);
  }

  SearchDoctors() {
  this.errorMessage = '';
  
  if (!this.selectedCity && this.selectedSpecializationId <= 0) {
    // show all doctors without filtering
    this.loadAllDoctors();
    return;
  }

  // Apply filtering
  this.loading = true;
  this.doctorService
    .searchDoctors(this.selectedCity, this.selectedSpecializationId, this.minRating)
    .then(res => {
      this.doctors = res.data;
      if (this.doctors.length === 0) {
        this.errorMessage = 'No doctors found for the selected criteria';
      }
    })
    .catch(err => {
      console.error(err);
      this.errorMessage = 'No Doctor Found In City';
    })
    .finally(() => (this.loading = false));
}
}
