
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
    totalIncome: number;
    totalExpenses: number;
    availableBalance: number;
    transactions: any[];
}

export interface ReportSummary {
    totalIncome: number;
    totalExpenses: number;
    availableBalance: number;
    categoryExpenses: { [category: string]: number };

    monthlySummary: {
        month: string;
        totalIncome: number;
        totalExpenses: number;
    }[];

    transactions: any[];
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    userId: number = 0;

    private baseUrl = 'https://personal-expense-tracker-backend-oek7.onrender.com/api/transactions';

    constructor(private http: HttpClient) { }

    setUserId(id: number) {
        this.userId = id;
    }

    getUserId(): number {
        return this.userId;
    }

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

    // Get financial report with category and monthly summaries
    getReportSummary(
        userId: number,
        startDate?: string,
        endDate?: string
    ): Observable<ReportSummary> {

        let params = new HttpParams();

        if (startDate) {
            params = params.set('startDate', startDate);
        }

        if (endDate) {
            params = params.set('endDate', endDate);
        }

        return this.http.get<ReportSummary>(
            this.baseUrl + '/report/' + userId,
            { params }
        );
    }
}
