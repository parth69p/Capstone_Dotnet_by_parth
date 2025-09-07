# Fracto (Angular + ASP.NET Core MVC)

Fracto is an online doctor appointment booking platform where users can search for doctors by city and specialization, book appointments, and cancel them if needed. The app supports two types of users: **User** and **Admin**.

---

## Tech Stack

- **Frontend:** Angular  
- **Backend:** ASP.NET Core MVC with Web API  
- **Database:** SQL Server (Entity Framework Core)  
- **File Storage:** Profile image upload on server  

---

## Key Features

### User

- Register, login, logout  
- Select city, specialization, and appointment date  
- View and filter doctors by rating  
- Book and cancel appointments  
- Receive booking confirmation  

### Admin

- Register, login, logout  
- CRUD operations on users and doctors  
- Manage appointments and confirmations  
- Cancel appointments  

---

## Architecture

- **Frontend (Angular):**  
  - User/Admin UI, Angular Router for navigation  
  - Consumes Web API for authentication, bookings, and management  
  - State management via Context API or Redux  

- **Backend (ASP.NET Core MVC):**  
  - Web API endpoints for users, doctors, appointments, ratings
  - EF Core for database operations
  - JWT authentication for secure sessions
  - File upload handling for profile images

- **Database (SQL Server):**  
  - Tables: Users, Doctors, Appointments, Ratings, Specializations  
  - Relationships: Users ↔ Appointments, Doctors ↔ Specializations  

## Setup


### Frontend

```bash
cd FractoFrontend
npm install
ng serve

## Here's My github for any case 
:https://github.com/parth69p/Capstone_Dotnet_by_parth
