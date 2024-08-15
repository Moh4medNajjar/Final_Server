import { Component } from '@angular/core';

@Component({
  selector: 'app-server-details',
  templateUrl: './server-details.component.html',
  styleUrl: './server-details.component.scss'
})
export class ServerDetailsComponent {
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
}
