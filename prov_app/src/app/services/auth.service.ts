import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private registerUrl = 'http://localhost:3000/api/auth/register';
  private loginUrl = 'http://localhost:3000/api/auth/login';

  constructor(private http: HttpClient) {}

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
}
