import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
// import { appRoutes } from './app/app.routes'; /???/ optional if you use routing

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(
      FormsModule,      // For ngModel
      HttpClientModule  // For HttpClient
    ),
    // provideRouter() // optional, only if you use routing
  ]
}).catch(err => console.error(err));
