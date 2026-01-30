import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '../../../material';
import { UsersService } from '../../../services/users/users';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MATERIAL_IMPORTS
  ],
  templateUrl: './add-user-dialog.html',
  styleUrl: './add-user-dialog.scss'
})
export class AddUserDialog {

  username = '';
  password = '';
  repeatPassword = '';

  hidePassword = true;
  hideRepeatPassword = true;

  constructor(
    private dialogRef: MatDialogRef<AddUserDialog>,
    private usersService: UsersService
  ) {}

  createUser() {
    if (this.password !== this.repeatPassword) {
      return;
    }

    this.usersService.registerUser({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () =>  {this.dialogRef.close(true); console.log('User registered');},
      error: err => console.error(err)
    });
  }
}