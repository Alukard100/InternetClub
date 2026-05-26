import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Register } from '../dialogs/register/register';
import { Login } from '../dialogs/login/login';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIcon
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  constructor(private router: Router, private dialog: MatDialog, public auth: AuthService) {
    this.auth.loggedIn$.subscribe(() => {

      this.isLoggedIn = this.auth.isLoggedIn();
      this.isUser = this.auth.isUser();
      this.isAdmin = this.auth.isAdmin();

    });    
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(Register, {
      width: '400px'
    });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(Login, {
      width: '400px'
    });
  }

  logout() {
    this.auth.logout();
  }

  AddFunds() {
    this.router.navigate(['/purchase']);
  }

  isUser = false;
  isAdmin = false;
  isLoggedIn = false;
}
