import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login-component';
import { RegisterComponent } from './auth/register-component/register-component';

export const routes: Routes = [
    
    // 👇 Default route (empty URL) redirects to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Lazy load auth module
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth-module').then(m => m.AuthModule)
  },

  { path: '**', redirectTo: 'login' }
];
