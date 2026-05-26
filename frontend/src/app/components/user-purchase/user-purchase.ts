import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/paypal/purchase-service';
import { AuthService } from '../../services/auth/auth-service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserTimePipe } from "../../pipes/user-time/user-time-pipe";
import { MATERIAL_IMPORTS } from '../../material';
import { UsersService } from '../../services/users/users';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-user-purchase',
  imports: [UserTimePipe, MATERIAL_IMPORTS, FormsModule],
  templateUrl: './user-purchase.html',
  styleUrl: './user-purchase.scss',
})
export class UserPurchase implements OnInit, AfterViewInit {

  amount = 6;
  updateAmount = 0;
  updateAmountTemp = 0;
  now = Date.now();
  data!: User;

  constructor(
    private purchaseService: PurchaseService, 
    private auth: AuthService,
    private userService: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.data = await firstValueFrom(
      this.userService.getMe()
    );

    this.getSeconds();
  }

  ngAfterViewInit(): void {
    this.renderPaypalButton();
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
    this.cdr.detectChanges();
  }

  updateSeconds() {
    if (this.amount != null)
      this.updateAmountTemp = this.updateAmount + this.amount * 600;
  }

  renderPaypalButton() {
    paypal.Buttons({

      createOrder: async (_data: any, _actions: any) => {

        const response = await firstValueFrom(
          this.purchaseService.createOrder(this.amount)
        );

        return response.orderId;

      },

      onApprove: async (data: any, _actions: any) => {

        const token = this.auth.getToken();

        if (!token)
          return;

        const payload = JSON.parse(atob(token.split('.')[1]));

        const userId = payload.sub;

        await firstValueFrom(
          this.purchaseService.captureOrder(
            userId,
            this.amount,
            data.orderID
          )
        );

        alert('Payment successful!');
        this.router.navigate(['/']);
      },

      onError: (err: any) => {
        console.error(err);
        alert('Paypal error occurred');
      }

    }).render('#paypal-button-container');
  }

  
  back() {
    this.router.navigate(["/"]);
  }  
}
