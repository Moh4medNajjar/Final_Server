import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit {
  constructor(private requestService: RequestService, private authService: AuthService, private router: Router) {}

  formData = {
    requesterId: '',
    fullName: '',
    position: '',
    matricule: '',
    vmName: '',
    description: '',
    operating_system: '',
    environment_type: '',
    desired_start_date: '',
    software_list: [],
    ram: '',
    vcpu: '',
    disk_space: '',
    openPorts: [],
    hasPublicIP: false
  };

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      // Extract user data (consider using a secure backend API instead)
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      console.log(userData);
      this.formData.requesterId = userData.id;
      this.formData.fullName = userData.fullName;
      this.formData.matricule = userData.matricule;
      this.formData.position = userData.position;
    }
  }

  successMessage: string | null = null;

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (typeof this.formData.hasPublicIP === 'string') {
        this.formData.hasPublicIP = this.formData.hasPublicIP === 'yes';
      }

      this.formData.desired_start_date = new Date(this.formData.desired_start_date).toISOString();
      console.log(this.formData)

      this.requestService.createRequest(this.formData).subscribe(
        response => {
          console.log('Request successfully created:', response);
          this.successMessage = 'Request submitted with success and is under review by our admins';
          form.resetForm();
          this.router.navigate(['/my-requests']);

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error => {
          console.error('Error creating request:', error);
          this.successMessage = 'There was an error submitting your request. Please try again later.';
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

}
