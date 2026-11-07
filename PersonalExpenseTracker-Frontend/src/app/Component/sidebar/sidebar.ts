
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/userservice';

declare var Swal: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  userId: number = 0;
  menuOpen: boolean = false;

  @Output() profileClick = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.userId = this.userService.getUserId();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openProfile() {
    this.profileClick.emit();
    this.closeMenu();
  }

  logout() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {

      if (result.isConfirmed) {

        // Remove JWT token
        localStorage.removeItem('accessToken');

        // Clear user ID
        this.userService.setUserId(0);

        this.router.navigate(['/login']).then(() => {

          Swal.fire({
            icon: 'success',
            title: 'Logged Out!',
            text: 'You have successfully logged out.',
            timer: 1500,
            showConfirmButton: false
          });

        });

      }

    });

  }

}
