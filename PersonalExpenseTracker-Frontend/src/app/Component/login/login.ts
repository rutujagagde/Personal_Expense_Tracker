
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

        if (response && response.id) {

          this.userService.setUserId(response.id);

          this.router.navigate(['/dashboard']);

        } else {

          this.errorMessage = 'Invalid email or password.';

        }
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Invalid email or password. Please try again.';

      }

    });
  }
}
