
package com.expensetracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.DashboardDTO;
import com.expensetracker.dto.ReportDTO;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private UserRepository user_repo;

    // Add transaction
    public Transaction addTransaction(Long userId, Transaction transaction) {

        Optional<User> opt = user_repo.findById(userId);

        if (opt.isPresent()) {
            transaction.setUser(opt.get());
            return repo.save(transaction);
        }

        return null;
    }

    // Get all transactions
    public List<Transaction> showAllTransactions(Long userId) {
        return repo.findByUserId(userId);
    }

    // Get income transactions
    public List<Transaction> showIncome(Long userId) {
        return repo.findByUserIdAndType(userId, "INCOME");
    }

    // Get expense transactions
    public List<Transaction> showExpense(Long userId) {
        return repo.findByUserIdAndType(userId, "EXPENSE");
    }

    // Get filtered dashboard summary
    public DashboardDTO getDashboardSummary(
            Long userId,
            String category,
            String type,
            LocalDate startDate,
            LocalDate endDate) {

        // 1. Get all transactions belonging to this user
        List<Transaction> allTransactions =
                repo.findByUserId(userId);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        // 2. Calculate the actual balance using all transactions
        for (Transaction transaction : allTransactions) {

            BigDecimal amount = transaction.getAmount();

            if (amount == null) {
                amount = BigDecimal.ZERO;
            }

            if ("INCOME".equalsIgnoreCase(transaction.getType())) {
                totalIncome = totalIncome.add(amount);

            } else if ("EXPENSE".equalsIgnoreCase(transaction.getType())) {
                totalExpenses = totalExpenses.add(amount);
            }
        }

        // 3. Calculate the actual available balance
        BigDecimal availableBalance =
                totalIncome.subtract(totalExpenses);

        // 4. Apply filters only to the transaction list
        List<Transaction> filteredTransactions =
                repo.filterTransactions(
                        userId, category, type, startDate, endDate);

        // 5. Return the dashboard data
        return new DashboardDTO(
                totalIncome,
                totalExpenses,
                availableBalance,
                filteredTransactions);
    }

    // Get transaction for editing
    public Transaction editTransaction(Long id, Long userId) {

        Optional<Transaction> opt = repo.findById(id);

        if (opt.isPresent()) {
            Transaction transaction = opt.get();

            if (transaction.getUser().getId()==(userId)) {
                return transaction;
            }
        }

        return null;
    }

    public List<Transaction> testExpenseFilter(Long userId) {
        return repo.findByUser_IdAndType(userId, "EXPENSE");
    }
    // Update transaction
    public Transaction updateTransaction(
            Long id, Long userId, Transaction transaction) {

        Optional<Transaction> opt = repo.findById(id);

        if (opt.isPresent()) {
            Transaction oldTransaction = opt.get();

            if (oldTransaction.getUser().getId()==(userId)) {

                oldTransaction.setType(transaction.getType());
                oldTransaction.setCategory(transaction.getCategory());
                oldTransaction.setAmount(transaction.getAmount());
                oldTransaction.setDescription(transaction.getDescription());
                oldTransaction.setTransactionDate(
                        transaction.getTransactionDate());

                return repo.save(oldTransaction);
            }
        }

        return null;
    }

    public boolean deleteTransaction(Long id, Long userId) {

        Optional<Transaction> opt = repo.findById(id);

        if (opt.isPresent()) {
            Transaction transaction = opt.get();

            if (transaction.getUser().getId()==(userId)) {
                repo.deleteById(id);
                return true;
            }
        }

        return false;
    }
    public ReportDTO getReportSummary(
            Long userId,
            LocalDate startDate,
            LocalDate endDate) {

        List<Transaction> transactions =
                repo.filterTransactions(userId, null, null, startDate, endDate);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        Map<String, BigDecimal> categoryExpenses = new LinkedHashMap<>();

        Map<YearMonth, ReportDTO.MonthlySummary> monthlyData = new TreeMap<>();

        for (Transaction transaction : transactions) {

            BigDecimal amount = transaction.getAmount();

            if (amount == null) {
                amount = BigDecimal.ZERO;
            }

            String type = transaction.getType();

            if ("INCOME".equalsIgnoreCase(type)) {
                totalIncome = totalIncome.add(amount);
            } else if ("EXPENSE".equalsIgnoreCase(type)) {
                totalExpenses = totalExpenses.add(amount);

                String category = transaction.getCategory();

                categoryExpenses.put(
                        category,
                        categoryExpenses.getOrDefault(category, BigDecimal.ZERO).add(amount)
                );
            }

            if (transaction.getTransactionDate() != null) {

                YearMonth month = YearMonth.from(transaction.getTransactionDate());

                ReportDTO.MonthlySummary summary = monthlyData.get(month);

                if (summary == null) {
                    summary = new ReportDTO.MonthlySummary(
                            month.toString(),
                            BigDecimal.ZERO,
                            BigDecimal.ZERO
                    );
                    monthlyData.put(month, summary);
                }

                if ("INCOME".equalsIgnoreCase(type)) {
                    summary.setTotalIncome(
                            summary.getTotalIncome().add(amount)
                    );
                } else if ("EXPENSE".equalsIgnoreCase(type)) {
                    summary.setTotalExpenses(
                            summary.getTotalExpenses().add(amount)
                    );
                }
            }
        }

        BigDecimal availableBalance = totalIncome.subtract(totalExpenses);

        return new ReportDTO(
                totalIncome,
                totalExpenses,
                availableBalance,
                categoryExpenses,
                new ArrayList<>(monthlyData.values()),
                transactions
        );
    }
}
