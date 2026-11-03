import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/userservice';
import {
  TransactionService,
  DashboardSummary
} from '../../services/transaction';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Sidebar,
    CurrencyPipe,
    DatePipe,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  loading = true;
  summaryLoading = false;

  user: any = null;
  userId: number = 0;

  totalIncome: number = 0;
  totalExpenses: number = 0;
  availableBalance: number = 0;

  transactions: any[] = [];

  // Selected filter values
  selectedCategory: string = '';
  selectedType: string = '';
  startDate: string = '';
  endDate: string = '';

  // Categories available in user's transactions
  categories: string[] = [];

  errorMessage: string = '';

  // Edit Profile details
  editUser: any = {
    name: '',
    email: '',
    password: ''
  };

  profileMessage = '';
  profileError = '';

  profileSubmitted = false;
  profileSaving = false;

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private _nav: Router
  ) {

    this.userId = this.userService.getUserId();

    if (this.userId) {
      this.getUser(this.userId);
      this.getDashboardSummary();
    } else {
      this.loading = false;
      this._nav.navigate(['/login']);
    }
  }

  // Get user details
  getUser(userId: number) {

    this.userService.getUserById(userId).subscribe({

      next: (response: any) => {

        this.user = response;
        this.loading = false;

      },

      error: (error) => {

        console.error('Error fetching user:', error);
        this.loading = false;

      }

    });

  }

  // Fetch summary and transactions from backend
  getDashboardSummary() {

    if (!this.userId) {
      return;
    }

    this.summaryLoading = true;
    this.errorMessage = '';

    this.transactionService.getDashboardSummary(
      this.userId,
      this.selectedCategory,
      this.selectedType,
      this.startDate,
      this.endDate
    ).subscribe({

      next: (response: DashboardSummary) => {

        this.totalIncome = response.totalIncome ?? 0;
        this.totalExpenses = response.totalExpenses ?? 0;
        this.availableBalance = response.availableBalance ?? 0;

        this.transactions = response.transactions ?? [];

        // Get category options from returned transactions
        this.categories = [
          ...new Set(
            this.transactions
              .map((transaction: any) => transaction.category)
              .filter((category: string) => !!category)
          )
        ].sort();

        this.summaryLoading = false;

      },

      error: (error) => {

        console.error('Error fetching dashboard summary:', error);

        this.errorMessage =
          'Unable to load dashboard summary.';

        this.summaryLoading = false;

      }

    });

  }

  // Apply selected filters
  applyFilters() {

    if (
      this.startDate &&
      this.endDate &&
      this.startDate > this.endDate
    ) {

      this.errorMessage =
        'Start date cannot be after end date.';

      return;
    }

    this.getDashboardSummary();

  }

  // Clear all filters
  clearFilters() {

    this.selectedCategory = '';
    this.selectedType = '';
    this.startDate = '';
    this.endDate = '';

    this.getDashboardSummary();

  }

  // Navigate to transactions
  Transaction() {

    this._nav.navigate([
      '/transactions',
      this.userId
    ]);

  }

  // Open Edit Profile Modal
  MyProfile() {

    this.editUser = {

      name: this.user?.name || '',
      email: this.user?.email || '',
      password: this.user?.password || ''

    };

    this.profileMessage = '';
    this.profileError = '';
    this.profileSubmitted = false;
    this.profileSaving = false;

    const modalElement =
      document.getElementById('editProfileModal');

    if (modalElement) {

      const modal =
        new (window as any).bootstrap.Modal(modalElement);

      modal.show();

    }

  }

  // Full Name validation
  isProfileNameValid(): boolean {

    const name = (this.editUser.name || '').trim();

    const namePattern =
      /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;

    return (
      name.length >= 3 &&
      name.length <= 50 &&
      namePattern.test(name)
    );

  }

  // Email validation
  isProfileEmailValid(): boolean {

    const email = (this.editUser.email || '').trim();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailPattern.test(email);

  }

  // Password validation
  isProfilePasswordValid(): boolean {

    return (
      typeof this.editUser.password === 'string' &&
      this.editUser.password.trim().length > 0
    );

  }

  // Close Edit Profile Modal
  cancelEditProfile() {

    const modalElement =
      document.getElementById('editProfileModal');

    if (modalElement) {

      const modal =
        (window as any).bootstrap.Modal.getInstance(
          modalElement
        );

      if (modal) {
        modal.hide();
      }

    }

  }

  // Update Profile
  updateProfile() {

    this.profileSubmitted = true;

    this.profileMessage = '';
    this.profileError = '';

    // Validate Full Name
    if (!this.isProfileNameValid()) {

      this.profileError =
        'Enter a valid full name using letters and spaces only.';

      return;

    }

    // Validate Email
    if (!this.isProfileEmailValid()) {

      this.profileError =
        'Please enter a valid email address.';

      return;

    }

    // Validate Password
    if (!this.isProfilePasswordValid()) {

      this.profileError =
        'Password is required.';

      return;

    }

    if (!this.userId) {

      this.profileError =
        'User session not found. Please login again.';

      return;

    }

    if (this.profileSaving) {
      return;
    }

    this.profileSaving = true;

    // Remove unnecessary spaces
    const updatedUser = {

      ...this.editUser,

      name: this.editUser.name.trim(),
      email: this.editUser.email.trim()

    };

    this.userService.updateUser(
      this.userId,
      updatedUser
    ).subscribe({

      next: (response: any) => {

        this.user = {
          ...this.user,
          ...response
        };

        this.profileMessage =
          'Profile updated successfully!';

        this.profileSaving = false;

        this.cancelEditProfile();

      },

      error: (error) => {

        console.error(
          'Profile update error:',
          error
        );

        this.profileError =
          error.error?.message ||
          'Unable to update profile. Please try again.';

        this.profileSaving = false;

      }

    });

  }

}