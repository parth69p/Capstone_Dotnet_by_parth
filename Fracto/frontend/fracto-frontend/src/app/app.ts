import { Component, OnInit, OnDestroy } from '@angular/core';
import {  RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth-service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  isLoggedIn = false;
  role: string | null = null;
  Username: string | null = null;
  private sub: Subscription[] = [];
  private cd: ChangeDetectorRef;
  constructor(private authService: AuthService, private router: Router, cd: ChangeDetectorRef) {
    this.cd = cd;
  }

  ngOnInit(): void {
    // Subscribe to login state
    this.sub.push(
      this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        if (!isLoggedIn) {
          this.Username = null;
          this.role = null;
        }
      })
    );
    // updating according to role
   this.sub.push(
      this.authService.role$.subscribe((role) => {
        this.role = role;
      })
    );
    // updating according to username
    this.sub.push(
      this.authService.username$.subscribe((name) => {
        this.Username = name ?? ''; // updates automatically
        this.cd.detectChanges(); // Manually trigger change detection
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.forEach(subscription => subscription.unsubscribe());
  }
}
