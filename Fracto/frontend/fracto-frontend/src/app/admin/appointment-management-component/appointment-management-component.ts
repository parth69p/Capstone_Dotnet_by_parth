import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin-service';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management-component.html',
  styleUrls: ['./appointment-management-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppointmentManagementComponent implements OnInit {
  appointments: any[] = [];
  selectedAppointment: any = null;

  constructor(private appointmentService: AdminService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

 
  async loadAppointments(): Promise<void> {
    try {
      this.appointments = await this.appointmentService.getAllAppointments();
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  }

  // Cancel appointment by Admin
  async cancelAppointment(id: number): Promise<void> {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await this.appointmentService.cancelAppointmentByAdmin(id);
        await this.loadAppointments();
      } catch (err) {
        console.error('Error cancelling appointment:', err);
      }
    }
  }

  //  Open update form
  openUpdateForm(appt: any): void {
    this.selectedAppointment = { ...appt }; // clone object
  }

  //  Submit update
  async submitUpdate(): Promise<void> {
    if (!this.selectedAppointment) return;

    try {
      await this.appointmentService.updateAppointmentByAdmin(
        this.selectedAppointment.id,
        this.selectedAppointment
      );
      this.selectedAppointment = null;
      await this.loadAppointments();
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  }
}
