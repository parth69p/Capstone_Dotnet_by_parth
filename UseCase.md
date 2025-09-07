# Use Case Document – Fracto

## Project Overview
**Fracto** is a healthcare management system that allows users to book appointments, manage doctors, specializations, and handle administrative tasks via a web interface. It provides secure authentication and role-based access for Admins and Patients.

---

## Actors
1. **Admin**
   - Manages doctors, specializations, and appointments.
   - Has access to all system features.
2. **Patient/User**
   - Registers, logs in, and books appointments.
   - Can view their appointments.
3. **Doctor** *(optional for future expansion)*
   - Can view assigned appointments.
   - May update their availability.

---

## Use Cases

### 1. User Registration
- **Actor:** Patient/User
- **Description:** User creates an account to access the system.
- **Preconditions:** User does not have an existing account.
- **Postconditions:** User account is created and stored in the database.
- **Steps:**
  1. User navigates to registration page.
  2. Fills in required details (name, password ,Profilephoto etc.).
  3. Submits the form.
  4. System validates input and saves user in the database.
  5. Confirmation message is displayed.

### 2. User Login
- **Actor:** Patient/User
- **Description:** Authenticate user to access system features.
- **Preconditions:** User must be registered.
- **Postconditions:** User is logged in and session is created.
- **Steps:**
  1. User enters credentials.
  2. System verifies credentials.
  3. If valid, user is redirected to dashboard.
  4. If invalid, error message is shown.

### 3. Admin Login
- **Actor:** Admin
- **Description:** Admin authentication to manage the system.
- **Preconditions:** Admin account exists.
- **Postconditions:** Admin gains access to management features.
- **Steps:**
  1. Admin enters credentials.
  2. System validates credentials.
  3. Admin is redirected to the Admin Dashboard.

### 4. Doctor Management
- **Actor:** Admin
- **Description:** Add, update, delete doctor information.
- **Preconditions:** Admin must be logged in.
- **Postconditions:** Doctor information is updated in the database.
- **Steps:**
  1. Admin navigates to Doctor Management page.
  2. Fills in doctor details.
  3. Submits form to add/update/delete doctor.
  4. System confirms operation success.

### 5. Specialization Management
- **Actor:** Admin
- **Description:** Manage doctor specializations.
- **Preconditions:** Admin must be logged in.
- **Postconditions:** Specialization data is updated in the system.
- **Steps:**
  1. Admin opens Specialization Management page.
  2. Adds/edits/deletes specializations.
  3. System confirms changes.

### 6. Appointment Booking
- **Actor:** Patient/User
- **Description:** Book appointments with doctors.
- **Preconditions:** User must be logged in.
- **Postconditions:** Appointment is scheduled and stored in database.
- **Steps:**
  1. User selects doctor and available time slot.
  2. Fills appointment details (reason, etc.).
  3. Submits booking.
  4. System confirms appointment and notifies user.

### 7. View Appointments
- **Actor:** Admin / Patient/User
- **Description:** View scheduled appointments.
- **Preconditions:** User/Admin must be logged in.
- **Postconditions:** List of appointments displayed.
- **Steps:**
  1. Navigate to Appointments page.
  2. System fetches appointments from database.
  3. Appointments are displayed in tabular/list format.

### 8. File Management (Optional)
- **Actor:** Admin
- **Description:** Upload and manage files for doctors/patients.
- **Preconditions:** Admin logged in.
- **Postconditions:** Files are saved and retrievable.
- **Steps:**
  1. Admin uploads file via interface.
  2. System stores file using FileService.
  3. Admin can view/download files.

---

## Additional Notes
- **Security:** All actions require proper authorization.
- **Time Slots:** Appointments are dynamically generated in 30-minute intervals.
- **Database:** Uses **FractoDbContext** for entity management.