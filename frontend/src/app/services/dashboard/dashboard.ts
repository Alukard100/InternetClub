import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardDto } from '../../interfaces/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData() {
    return this.http.get<DashboardDto>('/api/Dashboard');
  }
}
