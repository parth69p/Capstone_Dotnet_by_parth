import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:5213/api/Admin';
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl
    });

    // Attach JWT token automatically
    this.axiosInstance.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ================= USERS ==========================
  async getAllUsers(): Promise<any[]> {
    const res = await this.axiosInstance.get('/users');
    return res.data;
  }

  async createUser(formData: FormData): Promise<any> {
    //  Keep FormData for file uploads
    const res = await this.axiosInstance.post('/users', formData);
    return res.data;
  }

  async updateUser(id: number, formData: FormData): Promise<any> {
  const res = await this.axiosInstance.post(`/users/${id}`, formData);
  return res.data;
}

  async deleteUser(id: number): Promise<any> {
    const res = await this.axiosInstance.delete(`/users/${id}`);
    return res.data;
  }

  // =========================== DOCTORS =============================
  async getAllDoctors(): Promise<any[]> {
    const res = await this.axiosInstance.get('/doctors');
    return res.data;
  }

  async getDoctorsList(): Promise<any[]> {
    const res = await this.axiosInstance.get('/doctors-list');
    return res.data;
  }

  async createDoctor(formData: FormData): Promise<any> {
    const res = await this.axiosInstance.post('/doctors', formData);
    return res.data;
  }

  async updateDoctor(id: number, formData: FormData): Promise<any> {
    const res = await this.axiosInstance.put(`/doctors/${id}`, formData);
    return res.data;
  }

  async deleteDoctor(id: number): Promise<any> {
    const res = await this.axiosInstance.delete(`/doctors/${id}`);
    return res.data;
  }

  // ================= APPOINTMENTS =================
  async getAllAppointments(): Promise<any[]> {
    const res = await this.axiosInstance.get('/appointments');
    return res.data;
  }

  async cancelAppointmentByAdmin(id: number): Promise<any> {
    const res = await this.axiosInstance.put(`/${id}/admin-cancel`, {});
    return res.data;
  }

  async updateAppointmentByAdmin(id: number, appointment: any): Promise<any> {
    const res = await this.axiosInstance.put(`/${id}/admin-update`, appointment);
    return res.data;
  }

  // ================= SPECIALIZATIONS ===================
async getAllSpecializations(): Promise<any[]> {
  const res = await this.axiosInstance.get('/specializations');
  return res.data;
}

async createSpecialization(name: string): Promise<any> {
  const res = await this.axiosInstance.post('/specializations', {
    specializationName: name
  });
  return res.data;
}

async deleteSpecialization(id: number): Promise<any> {
  const res = await this.axiosInstance.delete(`/specializations/${id}`);
  return res.data;
}

async updateSpecialization(id: number, name: string): Promise<any> {
  const res = await this.axiosInstance.put(`/specializations/${id}`, {
    specializationId: id,                // ✅ must match backend DTO
    specializationName: name
  });
  return res.data;
}

}
