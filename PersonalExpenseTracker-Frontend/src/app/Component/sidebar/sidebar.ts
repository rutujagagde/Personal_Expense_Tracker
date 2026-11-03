import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/userservice';

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

    const confirmed = window.confirm(
      'Are you sure you want to logout?'
    );

    if (confirmed) {

      this.userService.setUserId(0);

      // Authentication token cleanup will be integrated
      // when we implement the JWT authentication service.

      this.router.navigate(['/login']);
    }

  }

}