import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  departments: string[] = ['IT Support', 'Development', 'HR', 'Finance', 'Administration'];
  successMessage: string | null = null;
  failureMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) { }
  fullName = ""
  matricule = ""
  position = ""
  role = ""
  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      // console.log(userData)
      this.fullName = userData.fullName
      this.matricule = userData.matricule
      this.position = userData.position
      this.role = userData.role
    }
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+216)?[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      position: ['', Validators.required],
      role: [''],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onLogout() {
    this.authService.logout();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      this.authService.register(userData).subscribe(
        (response: any) => {
          this.successMessage = 'User registered successfully';
          this.userForm.reset();
          setTimeout(() => this.successMessage = null, 3000);
        },
        (error: any) => {
          console.error('Error registering user:', error);
          this.failureMessage = 'A user with that matricule already exists';
          setTimeout(() => this.successMessage = null, 3000);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
