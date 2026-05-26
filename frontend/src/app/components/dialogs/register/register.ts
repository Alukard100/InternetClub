import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../material';
import { UsersService } from '../../../services/users/users';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  repeatPassword = new FormControl('', [Validators.required]);
  hidePassword = true;
  hidePassword1 = true;
  matchFail = false;

  constructor(private userService: UsersService, private dialogRef: MatDialogRef<Register>) { }

  Register() {
    this.matchFail = false;
    if (!this.username.valid || !this.password.valid || !this.repeatPassword.valid) return;
    if (this.password.value !== this.repeatPassword.value) {
      this.repeatPassword.setErrors({ mismatch: true });
      this.repeatPassword.markAsTouched();
      return;
    };

    this.repeatPassword.setErrors(null);

    this.userService.registerUser({
      username: this.username.value ?? '',
      password: this.password.value ?? ''
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: err => console.error('Registration failed', err)
    });
  }

  closeDio() {
    this.dialogRef.close();
  }

}
