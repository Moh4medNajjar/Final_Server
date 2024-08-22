import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://192.168.1.212:3000/api/auth/register';
  private loginUrl = 'http://192.168.1.212:3000/api/auth/login';

  constructor(private http: HttpClient, private router:Router) {}

  register(formData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, formData);
  }

  login(matricule: string, password: string): Observable<LoginResponse> {
    const body = { matricule, password };
    return this.http.post<LoginResponse>(this.loginUrl, body);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
