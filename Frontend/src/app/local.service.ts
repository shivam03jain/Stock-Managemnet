import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  setEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  removeEmail(): void {
    localStorage.removeItem('email');
  }


  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  removeToken(): void {
    localStorage.removeItem('jwtToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Modify this check based on your token validation logic
  }
}
