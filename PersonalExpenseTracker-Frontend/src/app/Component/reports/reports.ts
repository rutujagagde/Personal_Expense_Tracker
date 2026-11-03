
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/userservice';
import { TransactionService } from '../../services/transaction';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-reports',
  imports: [
    CurrencyPipe,
    DatePipe,
    KeyValuePipe,
    FormsModule,
    Sidebar
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {

  userId: number = 0;

  loading: boolean = false;
  errorMessage: string = '';

  // Report date filters
  startDate: string = '';
  endDate: string = '';

  // Financial summary
  totalIncome: number = 0;
  totalExpenses: number = 0;
  availableBalance: number = 0;

  // Category-wise expenses
  categoryExpenses: { [key: string]: number } = {};

  // Monthly report
  monthlySummary: any[] = [];

  // Transaction details
  transactions: any[] = [];

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router
  ) {

    this.userId = this.userService.getUserId();

    if (this.userId > 0) {

      // Default: Current month
      const today = new Date();

      this.startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      ).toLocaleDateString('en-CA');

      this.endDate = today.toLocaleDateString('en-CA');

      this.loadReport();

    } else {

      this.router.navigate(['/login']);

    }
  }

  // Load report from backend
  loadReport() {

    if (!this.userId) {
      return;
    }

    if (
      this.startDate &&
      this.endDate &&
      this.startDate > this.endDate
    ) {

      this.errorMessage = 'Start date cannot be after end date.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.transactionService.getReportSummary(
      this.userId,
      this.startDate,
      this.endDate
    ).subscribe({

      next: (response: any) => {

        this.totalIncome = response.totalIncome ?? 0;
        this.totalExpenses = response.totalExpenses ?? 0;
        this.availableBalance = response.availableBalance ?? 0;

        this.categoryExpenses =
          response.categoryExpenses ?? {};

        this.monthlySummary =
          response.monthlySummary ?? [];

        this.transactions =
          response.transactions ?? [];

        this.loading = false;

      },

      error: (error) => {

        console.error('Report loading error:', error);

        this.errorMessage =
          'Unable to load report. Please try again.';

        this.loading = false;

      }

    });
  }

  // Apply date filters
  applyFilters() {
    this.loadReport();
  }

  // Reset date filters
  clearFilters() {

    const today = new Date();

    this.startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toLocaleDateString('en-CA');

    this.endDate = today.toLocaleDateString('en-CA');

    this.loadReport();
  }

  // Navigate to dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Navigate to transactions
  goToTransactions() {
    this.router.navigate(['/transactions', this.userId]);
  }

  // Calculate category percentage for chart bars
  getCategoryPercentage(amount: number): number {

    const values = Object.values(this.categoryExpenses);

    const total = values.reduce(
      (sum, value) => sum + value, 0
    );

    if (total === 0) {
      return 0;
    }

    return (amount / total) * 100;
  }

}
