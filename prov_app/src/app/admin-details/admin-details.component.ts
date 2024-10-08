import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService} from '../services/auth.service'

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss'
})
export class AdminDetailsComponent implements OnInit {
  password = 'password here';
  hidePassword = true;
  copySuccess = false;

  onLogout() {
    this.authService.logout();
  }

  user: any = {}; // Object to hold user details
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  fullName = '';
  matricule = '';
  position = '';
  email = '';
  role = '';
  adminName = '';
  adminMatricule = '';
  adminPosition = '';
  adminEmail = '';
  adminRole = '';
  selectedRole: string = ''; // Holds the currently selected role

userData: any
  ngOnInit(): void {
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
    }
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (data: any) => {
          this.user = data;
          console.log('User details:', this.user);
        },
        (error: any) => {
          console.error('Error retrieving user details:', error);
        }
      );
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'NetworkAdmin':
        return '#39ff14'; // Neon Green
      case 'GeneralSpecAdmin':
        return '#ff8c00'; // Neon Orange
      case 'SuperAdmin':
        return '#00aaff'; // Electric Blue
      default:
        return '#b0b0b0'; // Light Gray for Ordinary User
    }
  }
updatedData: any
  updateUserRole(): void {
    // if (!this.selectedRole) {
    //   alert('Please select a role before updating.');
    //   return;
    // }

    if (this.userId) {
      // Determine role value based on selection
      this.updatedData = { role: this.selectedRole };

      // Log the payload to the console for debugging
      console.log('Payload sent to server:', this.updatedData);

      this.userService.updateUserRole(this.userId, this.updatedData).subscribe(
        (response: any) => {
          console.log('User role updated successfully:', response);
          window.location.reload();
        },
        (error: any) => {
          window.location.reload();
        }
      );
    } else {
      alert('No user ID provided.');
    }
  }


  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUserById(id).subscribe(
        (response: any) => {
          console.log('User deleted successfully:', response);
          this.router.navigate(['users-list'])
        },
        (error: any) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      );
    }
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
}
