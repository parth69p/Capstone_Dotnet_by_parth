import { Component, OnInit } from '@angular/core';
import { AppointmentService, AppointmentDto } from '../appointment-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list-component.html',
  styleUrls: ['./appointment-list-component.css'],
  imports: [CommonModule, FormsModule]
})
export class AppointmentListComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.errorMessage = '';
    this.appointmentService.getMyAppointments()
      .then(res => {
        this.appointments = res.data;
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = 'Failed to load appointments.';
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancelAppointment(appointmentId: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    this.appointmentService.cancelAppointment(appointmentId)
      .then(() => {
        this.appointments = this.appointments.filter(a => a.id !== appointmentId);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to cancel appointment.');
      });
  }
}
