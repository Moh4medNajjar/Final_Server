import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://192.168.1.100:3000/api/requests';

  constructor(private http: HttpClient, private authService: AuthService) { }

createRequest(requestData: any): Observable<any> {
  const token = this.authService.getToken();

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.post<any>(this.apiUrl, requestData, { headers });
}

getRequestsByUserId(userId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.apiUrl}/user/${userId}`, { headers });
}

getRequestById(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}

getRequests(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.apiUrl}`, {headers});
}

rejectRequest(requestId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.patch(`${this.apiUrl}/${requestId}/reject`, {}, { headers });
}



approveRequest(requestId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put(`${this.apiUrl}/${requestId}/approve`, {status: 'approved'}, { headers });
}




finishRequest(requestId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put(`${this.apiUrl}/${requestId}/approve/network`, {}, {headers});
}

getRequestsByStatus(status?: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  let params = new HttpParams();
  if (status) {
    params = params.set('status', status);
  }
  return this.http.get(this.apiUrl, { headers, params });
}


}
