import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

export interface EnvironmentStyle {
  icon: string;
  color: string;
}

export const environmentStyles: { [key: string]: EnvironmentStyle } = {
  'developing': { icon: 'fa-code-branch', color: '#66BB6A' }, // Light Green
  'testing': { icon: 'fa-check-double', color: '#42A5F5' }, // Bright Yellow
  'staging': { icon: 'fa-cogs', color: '#FF9800' }, // Amber
  'production': { icon: 'fa-shield-alt', color: '#FF5252' } // Bright Red
};

@Component({
  selector: 'app-server-details',
  templateUrl: './server-details.component.html',
  styleUrl: './server-details.component.scss'
})
export class ServerDetailsComponent implements OnInit {
  password = 'password here';
  hidePassword = true;
  copySuccess = false;
  server: any;
  serverId: any ;
  userData: any;
  adminName: any;
  adminMatricule: any;
  adminPosition: any;
  adminEmail: any;
  adminRole: any;
  matricule: any;
  id: any;
  showSuccessMessage: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private serverService: ServerService,
    private authService: AuthService
  ) {}
  onLogout() {
    this.authService.logout();
  }
  getEnvironmentStyle(environmentType: string): EnvironmentStyle {
    return environmentStyles[environmentType] || { icon: 'fa-question-circle', color: '#9E9E9E' }; // Default: gray question mark
  }
  ngOnInit() {
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
    this.route.paramMap.subscribe(params => {
      this.serverId = params.get('id');
      console.log('Server ID from route:', this.serverId);
      if (this.serverId) {
        this.fetchServerDetails(this.serverId);
      }
    });

  }

  fetchServerDetails(id: string) {
    this.serverService.getServerById(id).subscribe(
      (response: any) => {
        console.log('API Response:', response); // Log full response
        this.server = response;
      },
      (error: any) => {
        console.error('Error fetching server details:', error);
      }
    );
  }

  requestDelete(serverId: string) {
    this.serverService.requestDeleteServer(serverId).subscribe(
      (response: any) => {
        console.log("Delete request submitted !");
        this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 2500);
      },
      (error: any) => {
        console.error("Error submitting delete request !", error);
      }
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  copyPassword() {
    navigator.clipboard.writeText(this.server.password).then(() => {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  getMaskedPassword(): string {
    return '*'.repeat(this.server?.password.length || 0);
  }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm a');
  }

}
