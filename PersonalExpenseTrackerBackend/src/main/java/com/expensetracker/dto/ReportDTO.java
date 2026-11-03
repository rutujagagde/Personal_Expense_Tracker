
package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.expensetracker.entity.Transaction;

public class ReportDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal availableBalance;

    private Map<String, BigDecimal> categoryExpenses;

    private List<MonthlySummary> monthlySummary;

    private List<Transaction> transactions;

    public ReportDTO(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal availableBalance,
            Map<String, BigDecimal> categoryExpenses,
            List<MonthlySummary> monthlySummary,
            List<Transaction> transactions) {

        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.availableBalance = availableBalance;
        this.categoryExpenses = categoryExpenses;
        this.monthlySummary = monthlySummary;
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

    public Map<String, BigDecimal> getCategoryExpenses() {
        return categoryExpenses;
    }

    public void setCategoryExpenses(
            Map<String, BigDecimal> categoryExpenses) {
        this.categoryExpenses = categoryExpenses;
    }

    public List<MonthlySummary> getMonthlySummary() {
        return monthlySummary;
    }

    public void setMonthlySummary(
            List<MonthlySummary> monthlySummary) {
        this.monthlySummary = monthlySummary;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    // Inner class for monthly report
    public static class MonthlySummary {

        private String month;
        private BigDecimal totalIncome;
        private BigDecimal totalExpenses;

        public MonthlySummary() {
        }

        public MonthlySummary(
                String month,
                BigDecimal totalIncome,
                BigDecimal totalExpenses) {

            this.month = month;
            this.totalIncome = totalIncome;
            this.totalExpenses = totalExpenses;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
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
    }
}
