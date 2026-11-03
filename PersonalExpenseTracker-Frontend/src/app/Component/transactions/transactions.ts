
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
import { ActivatedRoute } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    Sidebar
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions {

  userId: number = 0;

  transactions: any[] = [];

  editId: number = 0;

  message: string = '';

  selectedTypeFilter: string = '';

  // Transaction Form
  transactionForm = new FormGroup({

    type: new FormControl('INCOME', [
      Validators.required
    ]),

    category: new FormControl('', [
      Validators.required,
      Validators.pattern(/.*\S.*/)
    ]),

    amount: new FormControl<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ),

    description: new FormControl('', [
      Validators.maxLength(250)
    ]),

    transactionDate: new FormControl(
      new Date().toLocaleDateString('en-CA'),
      Validators.required
    )

  });

  constructor(
    private service: TransactionService,
    private _route: ActivatedRoute,
    private userService: UserService
  ) {

    // Get User ID from route
    this._route.params.subscribe(p => {

      this.userId = Number(
        p['userId'] ||
        this.userService.getUserId() ||
        0
      );

      if (this.userId > 0) {

        this.showTransactions();

      } else {

        this.message =
          'User ID not found. Please log in again.';

      }

    });

    // Handle Income and Expense sidebar filters
    this._route.queryParamMap.subscribe(params => {

      const type = params.get('type');

      if (type === 'INCOME' || type === 'EXPENSE') {

        this.selectedTypeFilter = type;

        // Set default form type when adding a transaction
        if (this.editId === 0) {

          this.transactionForm.patchValue({
            type: type
          });

        }

      } else {

        this.selectedTypeFilter = '';

      }

    });

  }

  // Display transactions
  showTransactions() {

    if (this.userId === 0) {

      this.message =
        'User ID not found. Please log in again.';

      return;

    }

    this.service.getTransactions(this.userId).subscribe({

      next: (data: any) => {

        this.transactions = data;

        this.message = '';

      },

      error: (error) => {

        console.error(
          'Error loading transactions:',
          error
        );

        this.message =
          'Unable to load transactions.';

      }

    });

  }

  // Filter transactions for Income and Expenses
  get filteredTransactions(): any[] {

    if (!this.selectedTypeFilter) {

      return this.transactions;

    }

    return this.transactions.filter(
      item => item.type === this.selectedTypeFilter
    );

  }

  // Save Transaction
  saveTransaction() {

    if (this.transactionForm.invalid) {

      this.transactionForm.markAllAsTouched();

      return;

    }

    if (this.userId === 0) {

      this.message =
        'User ID not found. Please log in again.';

      return;

    }

    const transaction = this.transactionForm.getRawValue();

    if (this.editId === 0) {

      // Add transaction
      this.service.addTransaction(
        this.userId,
        transaction
      ).subscribe({

        next: () => {

          this.message =
            'Transaction added successfully.';

          this.resetForm();

          this.showTransactions();

        },

        error: (error) => {

          console.error(
            'Error adding transaction:',
            error
          );

          this.message =
            'Unable to add transaction.';

        }

      });

    } else {

      // Update transaction
      this.service.updateTransaction(
        this.userId,
        this.editId,
        transaction
      ).subscribe({

        next: () => {

          this.message =
            'Transaction updated successfully.';

          this.resetForm();

          this.showTransactions();

        },

        error: (error) => {

          console.error(
            'Error updating transaction:',
            error
          );

          this.message =
            'Unable to update transaction.';

        }

      });

    }

  }

  // Edit Transaction
  editTransaction(id: number) {

    this.service.editTransaction(
      this.userId,
      id
    ).subscribe({

      next: (data: any) => {

        this.editId = id;

        this.transactionForm.patchValue({

          type: data.type,

          category: data.category,

          amount: data.amount,

          description: data.description,

          transactionDate: data.transactionDate

        });

        this.message =
          'Edit the details and click Update.';

      },

      error: (error) => {

        console.error(
          'Error loading transaction:',
          error
        );

        this.message =
          'Unable to load transaction.';

      }

    });

  }

  // Delete Transaction
  deleteTransaction(id: number) {

    if (!confirm(
      'Are you sure you want to delete this transaction?'
    )) {

      return;

    }

    this.service.deleteTransaction(
      this.userId,
      id
    ).subscribe({

      next: () => {

        this.message =
          'Transaction deleted successfully.';

        this.showTransactions();

      },

      error: (error) => {

        console.error(
          'Error deleting transaction:',
          error
        );

        this.message =
          'Unable to delete transaction.';

      }

    });

  }

  // Reset Form
  resetForm() {

    this.editId = 0;

    this.transactionForm.reset({

      type: this.selectedTypeFilter || 'INCOME',

      category: '',

      amount: null,

      description: '',

      transactionDate:
        new Date().toLocaleDateString('en-CA')

    });

  }

}
