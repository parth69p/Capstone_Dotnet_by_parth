import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

export interface DoctorDto {
  id: number;
  name: string;
  city: string;
  rating: number;
  profileImagePath?: string;
  specializationId: number;
  specializationName: string;
}

export interface CreateDoctorDto {
  name: string;
  city: string;
  specializationId: number;
}

export interface UpdateDoctorDto {
  name: string;
  city: string;
  specializationId: number;
}

@Injectable({
  providedIn: 'root'
})

export class DoctorService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://localhost:5001/api/Doctor', // replace with your API URL
    });

    // Attach JWT token automatically if present
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ========================== USER SIDE ====================================

  
   // Fetch all unique cities from backend
  getCities() {
    return this.api.get<string[]>('/cities');
  }

  searchDoctors(city: string, specializationId: number, minRating: number = 0) {
    return this.api.get<DoctorDto[]>('/search', {
      params: { city, specializationId, minRating },
    });
  }

  // ========================= ADMIN SIDE ============================
  getDoctors() {
    return this.api.get<DoctorDto[]>('/');
  }

  createDoctor(createDto: CreateDoctorDto, profileImage?: File) {
    const formData = new FormData();
    formData.append('name', createDto.name);
    formData.append('city', createDto.city);
    formData.append('specializationId', createDto.specializationId.toString());

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return this.api.post<DoctorDto>('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  updateDoctor(id: number, updateDto: UpdateDoctorDto, profileImage?: File) {
    const formData = new FormData();
    formData.append('name', updateDto.name);
    formData.append('city', updateDto.city);
    formData.append('specializationId', updateDto.specializationId.toString());

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return this.api.put(`/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  deleteDoctor(id: number) {
    return this.api.delete(`/${id}`);
  }
}
