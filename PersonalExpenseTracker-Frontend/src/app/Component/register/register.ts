import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { UserService } from '../../services/userservice';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  user = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirm: new FormControl('')
  });

  constructor(
    private nav: Router,
    private userservice: UserService
  ) { }

  registerSubmit() {

    const formData = this.user.value;

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirm) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    this.userservice.register(userData).subscribe({

      next: (response: any) => {
        console.log('Registration response:', response);
        alert('Registration successful!');
        this.nav.navigate(['/login']);
      },

      error: (error: any) => {
        console.error('Registration error:', error);
        console.error('Status:', error.status);
        console.error('Backend message:', error.error);

        alert(
          'Registration failed. Check the browser console.'
        );
      }

    });
  }
}