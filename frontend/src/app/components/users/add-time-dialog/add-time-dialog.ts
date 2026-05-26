import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '../../../material';
import { User } from '../../../interfaces/user';
import { UserTimePipe } from '../../../pipes/user-time/user-time-pipe';
import { TransactionsService } from '../../../services/transactions/transactions';

@Component({
  selector: 'app-add-time-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MATERIAL_IMPORTS, UserTimePipe],
  templateUrl: './add-time-dialog.html',
  styleUrl: './add-time-dialog.scss',
})
export class AddTimeDialog {

  amount = new FormControl(0, [Validators.required, Validators.min(1)]);
  updateAmount = 0;
  updateAmountTemp = 0;
  now = Date.now();


  constructor(
    private dialogRef: MatDialogRef<AddTimeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private transactionService: TransactionsService
  ) { 
    this.getSeconds();
  }



  isActive(status: number): boolean {
    return status === 0;
  }

  getSeconds() {
    if (this.data.expiresAt == undefined) 
      this.updateAmount = this.data.availableSeconds;
    else {
      const expires = new Date(this.data.expiresAt).getTime();
      this.updateAmount = (expires - this.now) / 1000;
    }

    this.updateAmountTemp = this.updateAmount;
  }

  updateSeconds() {
    if (this.amount.value != null)
      this.updateAmountTemp = this.updateAmount + this.amount.value * 600;
  }

  updateUser() {
    if (!this.amount.valid) return;
    if (this.amount.value == null) return;

    this.transactionService.offlineTransaction({
      userId: this.data.id,
      amount: this.amount.value,
      type: 1
    }).subscribe({
      next: (result) => {this.dialogRef.close(true); },
      error: (err) => console.error(err)
    });
  }
}
