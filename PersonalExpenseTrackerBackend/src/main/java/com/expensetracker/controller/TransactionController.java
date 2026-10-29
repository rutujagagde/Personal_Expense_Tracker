
package com.expensetracker.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.expensetracker.dto.DashboardDTO;
import com.expensetracker.entity.Transaction;
import com.expensetracker.service.TransactionService;

@Controller
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    @Autowired
    private TransactionService service;

    // Add transaction
    @PostMapping("/add/{userId}")
    @ResponseBody
    public Transaction addTransaction(
            @PathVariable Long userId,
            @RequestBody Transaction transaction) {

        return service.addTransaction(userId, transaction);
    }

    // Get all transactions
    @GetMapping("/{userId}")
    @ResponseBody
    public List<Transaction> showAllTransactions(
            @PathVariable Long userId) {

        return service.showAllTransactions(userId);
    }

    // Get income transactions
    @GetMapping("/income/{userId}")
    @ResponseBody
    public List<Transaction> showIncome(
            @PathVariable Long userId) {

        return service.showIncome(userId);
    }

    // Get expense transactions
    @GetMapping("/expense/{userId}")
    @ResponseBody
    public List<Transaction> showExpense(
            @PathVariable Long userId) {

        return service.showExpense(userId);
    }

    // Dashboard summary with optional filters
    @GetMapping("/summary/{userId}")
    @ResponseBody
    public DashboardDTO getDashboardSummary(
            @PathVariable Long userId,

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            String type,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        return service.getDashboardSummary(
                userId, category, type, startDate, endDate);
    }

    // Get transaction for editing
    @GetMapping("/edit/{userId}/{id}")
    @ResponseBody
    public Transaction editTransaction(
            @PathVariable Long userId,
            @PathVariable Long id) {

        return service.editTransaction(id, userId);
    }

    // Update transaction
    @PutMapping("/update/{userId}/{id}")
    @ResponseBody
    public Transaction updateTransaction(
            @PathVariable Long userId,
            @PathVariable Long id,
            @RequestBody Transaction transaction) {

        return service.updateTransaction(id, userId, transaction);
    }

    // Delete transaction
    @DeleteMapping("/delete/{userId}/{id}")
    @ResponseBody
    public boolean deleteTransaction(
            @PathVariable Long userId,
            @PathVariable Long id) {

        return service.deleteTransaction(id, userId);
    }
}
