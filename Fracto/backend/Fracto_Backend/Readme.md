# Fracto Backend (ASP.NET Core MVC + Web API)

The backend of **Fracto** provides RESTful APIs for managing users, doctors, appointments, and specializations. It supports both **User** and **Admin** functionalities and communicates with the Angular frontend via JSON.

**Base URL:** `https://localhost:5213/api`

---

## Tech Stack

- **Framework:** ASP.NET Core MVC  
- **Database:** SQL Server with Entity Framework Core  
- **Authentication:** JWT-based authentication  
- **File Uploads:** Profile images for users and doctors   

---

## API Endpoints

### 1. **User APIs**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/User/register` | Register a new user (optional profile image) | No |
| POST | `/User/login` | Login and receive JWT token | No |
| POST | `/User/logout` | Logout (client should remove token) | Yes |

---

### 2. **Admin APIs**

**Users Management (Admin Only)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/Admin/users` | Get all users | Admin |
| POST | `/Admin/users` | Create new user with optional profile image | Admin |
| POST | `/Admin/users/{id}` | Update user info & profile image | Admin |
| DELETE | `/Admin/users/{id}` | Delete user | Admin |

**Doctors Management (Admin Only)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/Admin/doctors` | Get all doctors with specialization | Admin |
| GET | `/Admin/doctors-list` | Get doctors list | Admin |
| POST | `/Admin/doctors` | Add a new doctor | Admin |
| PUT | `/Admin/doctors/{id}` | Update doctor info & image | Admin |
| DELETE | `/Admin/doctors/{id}` | Delete doctor | Admin |

**Appointments Management (Admin Only)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/Admin/appointments` | Get all appointments | Admin |
| PUT | `/Admin/{id}/admin-cancel` | Cancel an appointment | Admin |
| PUT | `/Admin/{id}/admin-update` | Update an appointment | Admin |

**Specializations Management (Admin Only)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/Admin/specializations` | Get all specializations | Admin |
| POST | `/Admin/specializations` | Add a specialization | Admin |
| PUT | `/Admin/specializations/{id}` | Update specialization | Admin |
| DELETE | `/Admin/specializations/{id}` | Delete specialization | Admin |

---

### 3. **Doctor APIs (User & Admin)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/Doctors/search?city=&specializationId=&minRating=` | Search doctors by city, specialization, and rating | Yes |
| GET | `/Doctors/cities` | Get list of cities from doctor records | Yes |
| GET | `/Doctors/specializations` | Get list of specializations | No |
| GET | `/Doctors/all` | Get all doctors | Yes |

---

### 4. **Appointments APIs (User)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/Appointments` | Book a new appointment | Yes |
| GET | `/Appointments/my-appointments` | Get logged-in user's appointments | Yes |
| PUT | `/Appointments/{id}/cancel` | Cancel user's own appointment | Yes |

---

## Authentication

- **JWT Token** required for all protected endpoints.  
- Include token in the header:

## For Running Project

1. dotnet restore
2. dotnet ef database update
3. dotnet run

