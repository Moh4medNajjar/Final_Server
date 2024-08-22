import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:3000/api/requests';

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
  // Step 1: Log the request ID to ensure it's being passed correctly
  console.log(`Approving request with ID: ${requestId}`);

  // Step 2: Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  // Step 3: Check if the token is actually retrieved and log it
  if (!token) {
    console.error('Token not found in localStorage!');
    // Handle the error appropriately (e.g., redirect to login)
    return throwError('Authentication token is missing.');
  } else {
    console.log('Token retrieved successfully.');
  }

  // Step 4: Set up the headers with the token
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Step 5: Log the headers to ensure they are being set correctly
  console.log('Headers set:', headers);

  // Step 6: Log the API URL being called to confirm it's correct
  const apiUrl = `${this.apiUrl}/${requestId}/approve/general`;
  console.log('API URL:', apiUrl);

  // Step 7: Make the PATCH request and log the outcome
  return this.http.patch<any>(apiUrl, {}, { headers }).pipe(
    // Step 8: Log successful responses for confirmation
    tap(response => {
      console.log('Request approved successfully:', response);
    }),
    // Step 9: Catch and log any errors that occur during the request
    catchError(error => {
      console.error('Error occurred while approving the request:', error);
      // Provide a user-friendly error message
      return throwError('Failed to approve the request. Please try again.');
    })
  );
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
