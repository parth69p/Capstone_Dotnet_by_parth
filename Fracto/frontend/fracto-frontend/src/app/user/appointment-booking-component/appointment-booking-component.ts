import { Component, OnInit } from '@angular/core';
import { AppointmentService, CreateAppointmentDto } from '../appointment-service';
import { DoctorService, DoctorDto } from '../doctor-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking-component.html',
  imports: [FormsModule, CommonModule]
})
export class AppointmentBookingComponent implements OnInit {
  doctors: DoctorDto[] = [];
  selectedDoctorId: number = 0;
  appointmentDate: string = '';
  timeSlot: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading = true;
    this.doctorService.getAllDoctors()
      .then(res => { this.doctors = res.data; })
      .catch(err => console.error(err))
      .finally(() => this.loading = false);
  }

bookAppointment() {
  if (!this.selectedDoctorId || !this.appointmentDate || !this.timeSlot) {
    this.errorMessage = 'Please fill all fields.';
    this.successMessage = '';
    return;
  }

  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  const dto: CreateAppointmentDto = {
    doctorId: this.selectedDoctorId,
    appointmentDate: this.appointmentDate,
    timeSlot: this.timeSlot
  };
  // if date is of past it should not be done 
  const today = new Date();
  const selectedDate = new Date(this.appointmentDate);
  if (selectedDate < today) {
    this.errorMessage = 'Cannot book appointment in the past.';
    this.successMessage = '';
  } 
  else {
    this.appointmentService.bookAppointment(dto)
      .then(res => {
        this.successMessage = 'Appointment booked successfully!';
        this.selectedDoctorId = 0;
        this.appointmentDate = '';
      this.timeSlot = '';
    })
    .catch(err => {
      console.error(err);
      this.errorMessage = 'Failed to book appointment.';
    })
    .finally(() => this.loading = false);
  }

}
}
