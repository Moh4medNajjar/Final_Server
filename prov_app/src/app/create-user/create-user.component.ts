import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  userForm!: FormGroup;
  departments: string[] = ['IT Support', 'Development', 'HR', 'Finance', 'Administration'];
  permissionsList: string[] = []; // Array to hold added permissions

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }
  addPermission(): void {
    const permission = this.userForm.get('permissions')?.value;
    if (permission && !this.permissionsList.includes(permission)) {
      this.permissionsList.push(permission);
      this.userForm.get('permissions')?.reset(); // Clear the input field
    }
  }

  successMessage: string | null = null;

  onSubmit(): void {
    if (this.userForm.valid) {
      this.successMessage = 'Request submitted with success and is under review by our admins';
      console.log('Form Value:', this.userForm.value);
      console.log('Permissions List:', this.permissionsList);
      this.userForm.reset();

      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
      } else {
        console.log('Form is invalid');
      }
    }

}
