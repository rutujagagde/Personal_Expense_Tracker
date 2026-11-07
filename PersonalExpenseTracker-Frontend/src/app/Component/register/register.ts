
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/userservice';

declare var Swal: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  user: FormGroup;

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.user = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]

    });
  }

  // Easy access to form controls
  get f() {
    return this.user.controls;
  }

  // Remove numbers and special characters immediately
  filterFullName(event: Event) {

    const input = event.target as HTMLInputElement;

    const filteredValue = input.value.replace(/[^A-Za-z\s]/g, '');

    input.value = filteredValue;

    this.user.get('name')?.setValue(filteredValue);
  }

  // Check whether passwords match
  get passwordMismatch(): boolean {

    return this.user.get('confirmPassword')?.touched === true &&
      this.user.get('password')?.value !==
      this.user.get('confirmPassword')?.value;
  }

  registerSubmit() {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.user.invalid) {
      this.user.markAllAsTouched();
      return;
    }

    if (
      this.user.get('password')?.value !==
      this.user.get('confirmPassword')?.value
    ) {
      this.user.get('confirmPassword')?.markAsTouched();
      return;
    }

    this.loading = true;

    const userData = {
      name: this.user.value.name.trim(),
      email: this.user.value.email.trim(),
      password: this.user.value.password
    };

    this.userService.register(userData).subscribe({

      next: () => {

        this.loading = false;
        this.successMessage = 'Registration successful! Please login.';

        this.user.reset();

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created. Please login.',
          confirmButtonText: 'Go to Login'
        }).then(() => {

          this.router.navigate(['/login']);

        });

      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          error.error ||
          'Registration failed. Please try again.';

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: this.errorMessage
        });

      }

    });
  }
}
