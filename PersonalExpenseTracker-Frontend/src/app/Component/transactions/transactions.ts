
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { TransactionService } from '../../services/transaction';
import { UserService } from '../../services/userservice';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions {

  userId: number = 0;
  transactions: any[] = [];
  editId: number = 0;
  message: string = '';

  transactionForm = new FormGroup({
    type: new FormControl('INCOME', Validators.required),
    category: new FormControl('', Validators.required),
    amount: new FormControl<number | null>(
      null,
      [Validators.required, Validators.min(0.01)]
    ),
    description: new FormControl(''),
    transactionDate: new FormControl(
      new Date().toLocaleDateString('en-CA'),
      Validators.required
    )
  });

  constructor(
    private service: TransactionService,
    private _route: ActivatedRoute,
    private nav: Router,
    private userService: UserService
  ) {
    this._route.params.subscribe(p => {
      this.userId = Number(
        p['userId'] || this.userService.getUserId() || 0
      );

      if (this.userId > 0) {
        this.showTransactions();
      } else {
        this.message = 'User ID not found. Please log in again.';
      }
    });
  }

  showTransactions() {
    if (this.userId === 0) {
      this.message = 'User ID not found. Please log in again.';
      return;
    }

    this.service.getTransactions(this.userId).subscribe({
      next: (data: any) => {
        this.transactions = data;
        this.message = '';
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.message = 'Unable to load transactions.';
      }
    });
  }

  saveTransaction() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.userId === 0) {
      this.message = 'User ID not found. Please log in again.';
      return;
    }

    const transaction = this.transactionForm.getRawValue();

    if (this.editId === 0) {

      // Add transaction
      this.service.addTransaction(this.userId, transaction).subscribe({
        next: () => {
          this.message = 'Transaction added successfully.';
          this.resetForm();
          this.showTransactions();
        },
        error: (error) => {
          console.error('Error adding transaction:', error);
          this.message = 'Unable to add transaction.';
        }
      });

    } else {

      this.service.updateTransaction(
        this.userId,
        this.editId,
        transaction
      ).subscribe({
        next: () => {
          this.message = 'Transaction updated successfully.';
          this.resetForm();
          this.showTransactions();
        },
        error: (error) => {
          console.error('Error updating transaction:', error);
          this.message = 'Unable to update transaction.';
        }
      });

    }
  }

  editTransaction(id: number) {
    this.service.editTransaction(this.userId, id).subscribe({
      next: (data: any) => {
        this.editId = id;

        this.transactionForm.patchValue({
          type: data.type,
          category: data.category,
          amount: data.amount,
          description: data.description,
          transactionDate: data.transactionDate
        });

        this.message = 'Edit the details and click Update.';
      },
      error: (error) => {
        console.error('Error loading transaction:', error);
        this.message = 'Unable to load transaction.';
      }
    });
  }

  deleteTransaction(id: number) {
    if (!confirm('Do you want to delete this transaction?')) {
      return;
    }

    this.service.deleteTransaction(this.userId, id).subscribe({
      next: () => {
        this.message = 'Transaction deleted successfully.';
        this.showTransactions();
      },
      error: (error) => {
        console.error('Error deleting transaction:', error);
        this.message = 'Unable to delete transaction.';
      }
    });
  }

  // Clear form
  resetForm() {
    this.editId = 0;

    this.transactionForm.reset({
      type: 'INCOME',
      category: '',
      amount: null,
      description: '',
      transactionDate: new Date().toLocaleDateString('en-CA')
    });
  }

  // Back to Dashboard
  goToDashboard() {
    if (this.userId > 0) {
      this.nav.navigate(['/dashboard']);
    } else {
      this.message = 'User ID not found. Please log in again.';
    }
  }
}
