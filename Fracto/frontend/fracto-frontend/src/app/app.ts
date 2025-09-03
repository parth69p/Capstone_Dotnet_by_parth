import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { LoginComponent } from './Components/login-component/login-component';
import { LoginComponent } from './auth/login-component/login-component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fracto-frontend');
}
