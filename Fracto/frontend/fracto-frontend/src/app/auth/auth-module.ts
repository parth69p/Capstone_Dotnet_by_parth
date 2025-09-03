import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login-component/login-component';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule
  ],
  providers:[
    provideRouter(routes)
  ]
})
export class AuthModule { }
