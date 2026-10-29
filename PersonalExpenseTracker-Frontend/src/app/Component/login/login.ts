
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/userservice';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  user_data = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  user: any;

  constructor(
    private _nav: Router,
    private userService: UserService
  ) { }

  loginSubmit() {
    const formData = this.user_data.value;
    const userData = {
      email: formData.email,
      password: formData.password
    };
    this.userService.login(userData).subscribe({
      // next: (response: any) => {
      //   console.log('Login Successful');


      //   this._nav.navigate(['/dashboard'], {
      //     state: { userId: response.id }
      //   });
      // },
      next: (response: any) => {
        console.log('Login Successful');
        console.log('Logged-in User:', response);
        this.userService.setUserId(response.id);

        this._nav.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Incorrect email or password');
      }
    });
  }
}
