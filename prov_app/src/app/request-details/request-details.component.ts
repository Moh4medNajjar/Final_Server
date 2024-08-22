import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../services/request.service';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service'; // Ensure ServerService is imported

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {

  requestId!: string;
  requestDetails: any;
  serverForm!: FormGroup;
  fullName = "";
  matricule = "";
  position = "";
  email = "";
  role = "";
  adminName = "";
  adminMatricule = "";
  adminPosition = "";
  adminEmail = "";
  adminRole = "";
  id = "";
  userData: any

  hidePassword = true;
  copySuccess = false;
  password = 'password here'; // Consider generating or securely handling this password

  constructor(
    private serverService: ServerService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.serverForm = this.fb.group({
      vmName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      environment_type: ['', Validators.required],
      operating_system: ['', Validators.required],
      ram: ['', Validators.required],
      cpu: ['', Validators.required],
      disk_space: ['', Validators.required],
      privateIP: ['', Validators.required],
      subnetMask: ['', Validators.required],
      defaultGateway: ['', Validators.required],
      requestId: ['', Validators.required],
      requesterId: ['', Validators.required],
      requesterName: ['', Validators.required],
      requesterMatricule: ['', Validators.required],
      adminId: ['', Validators.required],
      adminName: ['', Validators.required],

    });

    this.route.paramMap.subscribe(params => {
      this.requestId = params.get('id')!;
      this.fetchRequestDetails(this.requestId);
    });

    const token = this.authService.getToken();
    if (token) {
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      this.userData = userData;
      this.adminName = userData.fullName;
      this.adminMatricule = userData.matricule;
      this.adminPosition = userData.position;
      this.adminEmail = userData.email;
      this.adminRole = userData.role;
      this.matricule = userData.matricule;
      this.id = userData.id;
    }
  }

  fetchRequestDetails(id: string) {
    this.requestService.getRequestById(id).subscribe(
      response => {
        this.requestDetails = response;
        this.serverForm.patchValue({
          vmName: this.requestDetails.vmName,
          requestId: this.requestDetails._id,
          requesterId: this.requestDetails.requesterId,
          requesterName: this.requestDetails.fullName,
          requesterMatricule: this.requestDetails.matricule,
          adminId: this.userData.id,
          adminName: this.userData.fullName,
          environment_type: this.requestDetails.environment_type,
          operating_system: this.requestDetails.operating_system,
          ram: this.requestDetails.ram,
          cpu: this.requestDetails.vcpu,
          disk_space: this.requestDetails.disk_space
        });
      },
      error => {
        console.error('Error fetching request details:', error);
      }
    );
  }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

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
          console.error('Barra nayyek ya zebi:', error);
        }
      );
    }
  }

  createServer() {
    // Extract values from the form
    const serverData = this.serverForm.value;

    // Ensure serverData contains only the necessary fields
    this.serverService.createServer(serverData).subscribe(
      (response) => {
        console.log('Server created successfully', response);
        // Update request status after server creation
        this.requestService.finishRequest(this.requestDetails._id).subscribe(
          (updateResponse) => {
            console.log('Request status updated successfully', updateResponse);
            this.router.navigate(['/my-requests']);
          },
          (error) => {
            console.error('Error updating request status', error);
          }
        );
      },
      (error) => {
        console.error('Error creating server', error);
      }
    );
  }

}
