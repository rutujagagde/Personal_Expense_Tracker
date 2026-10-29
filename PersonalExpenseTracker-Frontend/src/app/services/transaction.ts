
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface DashboardSummary {
    totalIncome: number;
    totalExpenses: number;
    availableBalance: number;
    transactions: any[];
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    userId: number = 0;

    setUserId(id: number) {
        this.userId = id;
    }

    getUserId(): number {
        return this.userId;
    }

    private baseUrl = 'http://localhost:8080/api/transactions';

    constructor(private http: HttpClient) { }

    // Add transaction
    addTransaction(userId: number, transaction: any) {
        return this.http.post(
            this.baseUrl + '/add/' + userId,
            transaction
        );
    }

    // Get all transactions
    getTransactions(userId: number) {
        return this.http.get(
            this.baseUrl + '/' + userId
        );
    }

    // Get income transactions
    getIncome(userId: number) {
        return this.http.get(
            this.baseUrl + '/income/' + userId
        );
    }

    // Get expense transactions
    getExpenses(userId: number) {
        return this.http.get(
            this.baseUrl + '/expense/' + userId
        );
    }

    // Get transaction for editing
    editTransaction(userId: number, id: number) {
        return this.http.get(
            this.baseUrl + '/edit/' + userId + '/' + id
        );
    }

    // Update transaction
    updateTransaction(
        userId: number,
        id: number,
        transaction: any
    ) {
        return this.http.put(
            this.baseUrl + '/update/' + userId + '/' + id,
            transaction
        );
    }

    // Delete transaction
    deleteTransaction(userId: number, id: number) {
        return this.http.delete(
            this.baseUrl + '/delete/' + userId + '/' + id
        );
    }

    // Get dashboard summary with optional filters
    getDashboardSummary(
        userId: number,
        category?: string,
        type?: string,
        startDate?: string,
        endDate?: string
    ): Observable<DashboardSummary> {

        let params = new HttpParams();

        if (category) {
            params = params.set('category', category);
        }

        if (type) {
            params = params.set('type', type);
        }

        if (startDate) {
            params = params.set('startDate', startDate);
        }

        if (endDate) {
            params = params.set('endDate', endDate);
        }

        return this.http.get<DashboardSummary>(
            this.baseUrl + '/summary/' + userId,
            { params }
        );
    }
}
