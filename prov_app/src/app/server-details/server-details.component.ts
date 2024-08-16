import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
import { DatePipe } from '@angular/common';

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
  serverId: string | null = null;

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private serverService: ServerService
  ) {}

  ngOnInit() {
    // Get server ID from route parameters
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
