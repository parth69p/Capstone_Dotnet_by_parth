import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DoctorService } from '../doctor-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-selection',
  imports:[FormsModule,CommonModule],
  templateUrl: './city-selection-component.html',
})
export class CitySelectionComponent implements OnInit {
  cities: string[] = [];
  selectedCity: string = '';

  @Output() citySelected = new EventEmitter<string>();

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getCities().then((res) => {
      this.cities = res.data;
    });
  }

  onCityChange() {
    this.citySelected.emit(this.selectedCity);
  }
}
