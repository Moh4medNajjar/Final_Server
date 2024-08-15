import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../services/request.service';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss'
})
export class RequestDetailsComponent implements OnInit {

  requestId!: string;
  requestDetails: any;

  constructor(private router: Router, private route: ActivatedRoute, private requestService: RequestService, private authService: AuthService, private datePipe: DatePipe) { }
  fullName = ""
  matricule = ""
  position = ""
  email = ""
  role = ""
  adminName = ""
  adminMatricule = ""
  adminPosition = ""
  adminEmail = ""
  adminRole = ""

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.requestId = params.get('id')!;
      this.fetchRequestDetails(this.requestId);
    });

    const token = this.authService.getToken();
    if (token) {
      // Extract user data (consider using a secure backend API instead)
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      console.log(userData)
      this.adminName = userData.fullName
      this.adminMatricule = userData.matricule
      this.adminPosition = userData.position
      this.adminEmail = userData.email
      this.adminRole = userData.role
    }
  }

  fetchRequestDetails(id: string) {
    this.requestService.getRequestById(id).subscribe(
      response => {
        this.requestDetails = response;
        // console.log('Request Details:', this.requestDetails);
      },
      error => {
        console.error('Error fetching request details:', error);
      }
    );
  }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  //**************************************************************/
  password = 'password here';
  hidePassword = true;
  copySuccess = false;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  copyPassword() {
    navigator.clipboard.writeText(this.password).then(() => {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  rejectRequest(): void {
    if (this.requestId) {
      this.requestService.rejectRequest(this.requestId).subscribe(
        response => {
          this.router.navigate(['/my-requests']);
        },
        error => {
          console.error('Error rejecting request:', error);
          // Handle error
        }
      );
    }
  }

  approveRequest(): void {
    if (this.requestId) {
      this.requestService.approveRequest(this.requestId).subscribe(
        response => {
          this.router.navigate(['/my-requests']);
        },
        error => {
          console.error('Error approving request:', error);
          // Handle error
        }
      );
    }
  }
}
