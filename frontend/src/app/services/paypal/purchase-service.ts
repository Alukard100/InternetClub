import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface CreateOrderResponse {
  orderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  
  constructor(private http: HttpClient) {}

  createOrder(amount: number): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`api/paypal/create`, {
      amount
    });
  }

  captureOrder(userId: string, amount: number, orderId: string) {
    return this.http.post(`api/paypal/capture`, {
      userId, amount, orderId
    });
  }
  
}
