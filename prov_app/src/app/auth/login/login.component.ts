import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup;
  departments: string[] = ['IT Support', 'Development', 'HR', 'Finance', 'Administration'];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      password: ['', [Validators.required]],
      matricule: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }


  onSubmit() {
    if (this.userForm.valid) {
      const { matricule, password } = this.userForm.value;
      this.authService.login(matricule, password).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          if (response.token) {
            this.router.navigate(['/my-requests']);
            localStorage.setItem('token', response.token);
            console.log('Token stored in local storage');
          } else {
            console.error('Token not found in response');
          }
        },
        error: (error: any) => {
          console.error('Login failed', error);
          // Display error message to the user
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
