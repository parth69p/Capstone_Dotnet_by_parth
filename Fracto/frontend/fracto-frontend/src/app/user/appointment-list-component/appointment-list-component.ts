import { Component, OnInit } from '@angular/core';
import { AppointmentService, AppointmentDto } from '../appointment-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-list',
  imports:[FormsModule,CommonModule],
  templateUrl: './appointment-list-component.html'
})
export class AppointmentListComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getMyAppointments()
      .then(res => {
        // Filter only booked appointments
        this.appointments = res.data.filter(a => a.status === 'Booked');
      })
      .catch(err => this.errorMessage = 'Failed to load appointments.')
      .finally(() => this.loading = false);
  }

  cancelAppointment(id: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    this.appointmentService.cancelAppointment(id)
      .then(() => this.loadAppointments())
      .catch(err => alert('Failed to cancel appointment.'));
  }
}
