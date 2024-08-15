import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss'
})
export class AdminDetailsComponent implements OnInit {
  password = 'password here';
  hidePassword = true;
  copySuccess = false;

  user: any = {}; // Object to hold user details
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the user ID from the route parameters
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
  } /**/

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUserById(id).subscribe(
        (response: any) => {
          console.log('User deleted successfully:', response);
          this.router.navigate(['users-list'])
        },
        (error: any) => {
          console.error('Error deleting user:', error);
          // Optionally, show an error message to the user
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
