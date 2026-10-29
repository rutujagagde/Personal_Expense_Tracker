
package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

import com.expensetracker.entity.Transaction;

public class DashboardDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal availableBalance;

    private List<Transaction> transactions;

    public DashboardDTO() {
    }

    public DashboardDTO(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal availableBalance,
            List<Transaction> transactions) {

        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.availableBalance = availableBalance;
        this.transactions = transactions;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getAvailableBalance() {
        return availableBalance;
    }

    public void setAvailableBalance(BigDecimal availableBalance) {
        this.availableBalance = availableBalance;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
