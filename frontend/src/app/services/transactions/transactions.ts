import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResult } from '../../interfaces/paged-result';
import { Transaction } from '../../interfaces/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private http: HttpClient) {}

  offlineTransaction(transaction: { userId: string,  amount: number, type: number}) {
    return this.http.post('/api/Transaction', transaction);
  }

  getTransactions(username: string = '', startDate: string = '', endDate: string = '', type: number = 2, pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<PagedResult<Transaction>>('/api/Transaction', {
      params: {
        username, startDate, endDate, type, pageNumber, pageSize
      }
    });
  }
  
}
