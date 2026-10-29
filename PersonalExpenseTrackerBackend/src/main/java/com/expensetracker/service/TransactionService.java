
package com.expensetracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.DashboardDTO;
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

        List<Transaction> transactions = repo.filterTransactions(
                userId, category, type, startDate, endDate);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {

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

        BigDecimal availableBalance =
                totalIncome.subtract(totalExpenses);

        return new DashboardDTO(
                totalIncome,
                totalExpenses,
                availableBalance,
                transactions);
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

    // Delete transaction
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
}
