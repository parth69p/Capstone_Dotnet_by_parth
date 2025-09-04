import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

export interface CreateAppointmentDto {
  doctorId: number;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
}

export interface AppointmentDto {
  id: number;
  userId: number;
  userName: string;
  doctorId: number;
  doctorName: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://localhost:5213/api/Appointment', // API URL
    });

    // Attach JWT token automatically
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Book a new appointment
  bookAppointment(createDto: CreateAppointmentDto) {
    return this.api.post<AppointmentDto>('/', createDto);
  }

  // Get all appointments for logged-in user
  getMyAppointments() {
    return this.api.get<AppointmentDto[]>('/my-appointments');
  }

  // Cancel an appointment
  cancelAppointment(id: number) {
    return this.api.put(`/` + id + `/cancel`);
  }

  // Admin: Get all appointments
  getAllAppointments() {
    return this.api.get<AppointmentDto[]>('/');
  }
}
