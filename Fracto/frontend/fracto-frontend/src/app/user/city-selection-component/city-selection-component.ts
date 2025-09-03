import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../doctor-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-selection-component',
  imports:[CommonModule,FormsModule],
  templateUrl: './city-selection-component.html',
  styleUrls: ['./city-selection-component.css']
})
export class CitySelectionComponent implements OnInit {

  cities: string[] = []; // list of cities
  selectedCity: string = '';

  constructor(
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    // Static cities for now; later you can fetch dynamically from API
    this.cities = ['New York', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];
  }

  onSubmit() {
    if (!this.selectedCity) {
      alert('Please select a city');
      return;
    }

    // Store the selected city in localStorage or a shared service
    localStorage.setItem('selectedCity', this.selectedCity);

    // Navigate to next step (specialist selection)
    this.router.navigate(['/specialist-selection']);
  }

}
