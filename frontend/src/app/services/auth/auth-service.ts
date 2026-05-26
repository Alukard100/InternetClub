import { Injectable } from '@angular/core';
import { UserRole } from '../../interfaces/user';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  UserRole = UserRole; // Expose enum to template

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getRole(): UserRole | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === 'Admin') return UserRole.Admin;

      if (role === 'User') return UserRole.User;

      return null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === UserRole.Admin;
  }

  isUser(): boolean {
    return this.getRole() === UserRole.User;
  }

  logout() {
    localStorage.removeItem('token');
    // localStorage.removeItem('role');

    this.loggedInSubject.next(false);

    this.router.navigate(['/']);
  }

  login(token: string) {
    localStorage.setItem('token', token);

    this.loggedInSubject.next(true);
  }
}
