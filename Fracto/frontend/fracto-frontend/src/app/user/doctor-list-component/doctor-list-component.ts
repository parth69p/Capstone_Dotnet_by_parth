import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { DoctorDto } from '../doctor-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-list-component',
  imports: [FormsModule,CommonModule],
  templateUrl: './doctor-list-component.html',
  styleUrl: './doctor-list-component.css'
})
export class DoctorListComponent {
  private baseUrl = 'https://localhost:5213/';
  @Input() doctors: DoctorDto[] = [];
}
