import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userForm!: FormGroup;
  departments: string[] = ['IT Support', 'Development', 'HR', 'Finance', 'Administration'];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      position: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      this.authService.register(formData).subscribe({
        next: (response: { message: any }) => {
          console.log(response.message);
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Registration failed', error);
        }
      });
    }
  }
}
