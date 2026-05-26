import { ChangeDetectorRef, Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users/users';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth/auth-service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  hidePassword = true;

  constructor(private userService: UsersService, private dialogRef: MatDialogRef<Login>, private auth: AuthService) { }

  Login() {
    if (!this.username.valid || !this.password.valid) return;
    this.userService.login({
      username: this.username.value ?? '',
      password: this.password.value ?? ''
    }).subscribe({
      next: (res: any) => {
        this.auth.login(res.token);

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 500);
      },
      error: err => console.error('Login failed', err)
    });
  }

  closeDio() {
    this.dialogRef.close();
  }

}
