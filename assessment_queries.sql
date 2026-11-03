-- SpendWise Personal Expense Tracker
-- Basic SQL Assessment: 8 Queries
-- Database: db_personal_expense_tracker
-- Tables: transactions, user
-- Run these queries in MySQL or DBeaver.

USE db_personal_expense_tracker;


-- 1. Display all transactions
SELECT *
FROM transactions;


-- 2. Find expenses above ₹1,000
SELECT *
FROM transactions
WHERE type = 'EXPENSE'
  AND amount > 1000;


-- 3. Calculate total income
SELECT SUM(amount) AS total_income
FROM transactions
WHERE type = 'INCOME';


-- 4. Calculate total expense
SELECT SUM(amount) AS total_expense
FROM transactions
WHERE type = 'EXPENSE';


-- 5. Calculate balance (total income - total expense)
SELECT
    SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END)
    -
    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS balance
FROM transactions;


-- 6. Group expenses by category
SELECT category, SUM(amount) AS total_expense
FROM transactions
WHERE type = 'EXPENSE'
GROUP BY category;


-- 7. Find transactions for October 2026
SELECT *
FROM transactions
WHERE transaction_date >= '2026-10-01'
  AND transaction_date < '2026-11-01';


-- 8. Join users with their transactions
SELECT
    user.name,
    user.email,
    transactions.description,
    transactions.category,
    transactions.amount,
    transactions.type
FROM user
JOIN transactions
    ON user.id = transactions.user_id;
