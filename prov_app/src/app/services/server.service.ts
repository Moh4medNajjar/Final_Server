import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private apiUrl = 'http://localhost:3000/api/servers';

  constructor(private authService:AuthService, private http: HttpClient) {}

  createServer(serverData: any): Observable<any> {
    const token = this.authService.getToken();

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.post<any>(this.apiUrl, serverData, { headers });
  }
}
