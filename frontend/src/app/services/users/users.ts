import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResult } from '../../interfaces/paged-result';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(search: string = '', pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<PagedResult<User>>('/api/User', {
      params: {
        search, pageNumber, pageSize
      }
    });
  }

  registerUser(user: { username: string; password: string }) {
    return this.http.post('/api/User/register', user);
  }

  activateUser(id: string) {
    return this.http.patch(`/api/User/start/${id}`, {});
  }

  deactivateUser(id: string) {
    return this.http.patch(`/api/User/stop/${id}`, {});
  }

  login(user: { username: string; password: string }) {
    return this.http.post('/api/User/login', user);
  }

  getMe() {
    return this.http.get<User>('/api/User/me');
  }

}
