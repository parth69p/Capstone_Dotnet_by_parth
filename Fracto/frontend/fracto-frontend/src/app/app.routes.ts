import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login-component';
import { RegisterComponent } from './auth/register-component/register-component';
import { SpecialistSelectionComponent } from './user/specialist-selection-component/specialist-selection-component';
import { AppointmentBookingComponent } from './user/appointment-booking-component/appointment-booking-component';
import { AppointmentListComponent } from './user/appointment-list-component/appointment-list-component';
import { AdminDashboardComponent } from './admin/admin-dashboard-component/admin-dashboard-component';
export const routes: Routes = [
    
    // 👇 Default route (empty URL) redirects to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'specialist-selection', component: SpecialistSelectionComponent },
  {path:'register',component:RegisterComponent},
  {path:'appointment-book',component: AppointmentBookingComponent},
  {path:'appointment-list', component:AppointmentListComponent},
  {path:'admin-dashboard', component:AdminDashboardComponent},


  // Lazy load auth module
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth-module').then(m => m.AuthModule)
  },

  { path: '**', redirectTo: 'login' }
];
