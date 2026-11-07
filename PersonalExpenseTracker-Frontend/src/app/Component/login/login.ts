
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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  user_data: FormGroup;

  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.user_data = this.fb.group({

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
      ]

    });
  }

  // Easy access to form controls
  get f() {
    return this.user_data.controls;
  }

  // Remove spaces immediately while typing email
  filterEmail(event: Event) {

    const input = event.target as HTMLInputElement;

    const filteredValue = input.value.replace(/\s/g, '');

    input.value = filteredValue;

    this.user_data.get('email')?.setValue(filteredValue);
  }

  // Login
  loginSubmit() {

    this.errorMessage = '';

    if (this.user_data.invalid) {
      this.user_data.markAllAsTouched();
      return;
    }

    this.loading = true;

    const userData = {
      email: this.user_data.value.email.trim(),
      password: this.user_data.value.password
    };

    this.userService.login(userData).subscribe({

      next: (response: any) => {

        this.loading = false;

        // Get JWT tokens and user details
        const accessToken = response?.accessToken;
        const refreshToken = response?.refreshToken;
        const userId = response?.user?.id;

        // Check login response
        if (
          accessToken &&
          refreshToken &&
          userId !== undefined &&
          userId !== null &&
          Number(userId) > 0
        ) {

          // Store JWT access token
          localStorage.setItem('accessToken', accessToken);

          // Store refresh token
          localStorage.setItem('refreshToken', refreshToken);

          // Store logged-in user ID
          this.userService.setUserId(Number(userId));

          // Success alert
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome to SpendWise.',
            confirmButtonText: 'Continue',
            allowOutsideClick: false
          }).then(() => {

            this.router.navigate(['/dashboard']);

          });

        } else {

          this.errorMessage =
            'Invalid login response. User ID or JWT token is missing.';

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: this.errorMessage,
            confirmButtonText: 'OK'
          });

        }
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Invalid email or password. Please try again.';

        // Error alert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: this.errorMessage,
          confirmButtonText: 'OK'
        });

      }

    });
  }
}
