import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService} from '../services/auth.service'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
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

  updateUserRole(): void {
    if (!this.selectedRole) {
      alert('Please select a role before updating.');
      return;
    }

    if (this.userId) {
      const updatedData = { role: this.selectedRole };

      // Log the payload to the console
      console.log('Payload sent to server:', updatedData);

      this.userService.updateUserRole(this.userId, updatedData).subscribe(
        (response: any) => {
          console.log('User role updated successfully:', response);
          alert('User role updated successfully.');
          window.location.reload();
        },
        (error: any) => {
          console.error('Error updating user role:', error);
          window.location.reload();
        }
      );
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
