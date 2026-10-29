
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/userservice';
import {
  TransactionService,
  DashboardSummary
} from '../../services/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe],
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

  // Categories available in the user's transactions
  categories: string[] = [];

  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private _nav: Router
  ) {
    // this.userId = Number(history.state.userId) ;
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
        this.errorMessage = 'Unable to load dashboard summary.';
        this.summaryLoading = false;
      }
    });
  }

  // Apply selected filters
  applyFilters() {
    if (this.startDate && this.endDate &&
      this.startDate > this.endDate) {
      this.errorMessage = 'Start date cannot be after end date.';
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

  // Logout
  logout() {
    this._nav.navigate(['/login']);
  }

  // Navigate to transactions
  Transaction() {
    this._nav.navigate(['/transactions', this.userId]);
  }
}
