import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService, CreateAppointmentDto } from '../appointment-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking-component.html',
  styleUrls: ['./appointment-booking-component.css'],
  imports: [FormsModule,CommonModule,ReactiveFormsModule]
})
export class AppointmentBookingComponent implements OnInit {
  selectedDoctorId: number = 0;
  selectedDoctorName: string = '';
  appointmentDate: string = '';
  timeSlot: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  timeSlots: string[] = [];
  // gernereate time slots from 9:00 AM to 5:00 PM with 30 min interval

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Read doctor info from query params
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) this.selectedDoctorId = +params['doctorId'];
      if (params['doctorName']) this.selectedDoctorName = params['doctorName'];
    });

    this.generateTimeSlots();
  }

    generateTimeSlots() {
    const startHour = 9;   // 9 AM
    const endHour = 17;    // 5 PM
    const slots: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      // 00 minutes slot
      slots.push(`${this.formatRange(hour, 0, hour, 30)}`);
      // 30 minutes slot
      if (hour < endHour - 1) { // avoid creating 17:30
        slots.push(`${this.formatRange(hour, 30, hour + 1, 0)}`);
      }
    }

    this.timeSlots = slots;
  }

  private formatRange(startHour: number, startMin: number, endHour: number, endMin: number): string {
    const start = this.formatTime(startHour, startMin);
    const end = this.formatTime(endHour, endMin);
    return `${start} - ${end}`;
  }

  private formatTime(hour: number, minutes: number): string {
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }


  bookAppointment() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedDoctorId || !this.appointmentDate || !this.timeSlot) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    // Prevent past date selection
    const today = new Date();
    const selectedDate = new Date(this.appointmentDate);
    if (selectedDate < new Date(today.toDateString())) { 
      this.errorMessage = 'Cannot book appointment in the past.';
      return;
    }

    this.loading = true;

    const dto: CreateAppointmentDto = {
      doctorId: this.selectedDoctorId,
      appointmentDate: this.appointmentDate,
      timeSlot: this.timeSlot
    };

    this.appointmentService.bookAppointment(dto)
      .then(res => {
        this.successMessage = 'Appointment booked successfully!';
        this.appointmentDate = '';
        this.timeSlot = '';
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = 'Failed to book appointment.';
      })
      .finally(() => this.loading = false);
  }
  todayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

}
