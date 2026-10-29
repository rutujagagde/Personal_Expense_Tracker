# SpendWise - Personal Expense Tracker

## Project Overview

SpendWise is a Personal Expense Tracker application that helps users manage their income and expenses, organize transactions by category, and monitor their financial activity.

## Technologies Used

- **Frontend:** Angular, HTML, CSS, Bootstrap
- **Backend:** Java, Spring Boot, REST APIs
- **Database:** MySQL
- **Database Tool:** DBeaver
- **Version Control:** Git and GitHub

## Main Features

- User Registration and Login
- Dashboard
- Add and View Transactions
- Income and Expense Management
- Category-wise Expense Filtering
- Total Income and Expense Calculation
- Balance Calculation

## Project Architecture

Angular Frontend → Spring Boot REST API → MySQL Database

- Angular collects user input and displays information.
- Spring Boot processes requests and handles application logic.
- MySQL stores user and transaction data.

## Database Details

**Database Name:** `db_personal_expense_tracker`

**Tables:**
- `user`
- `transactions`

The `transactions` table contains transaction details such as amount, category, description, date, type, and user ID.

## SQL Assessment

The `assessment.sql` file contains eight basic SQL queries:

1. Display all transactions
2. Find expenses above ₹1,000
3. Calculate total income
4. Calculate total expenses
5. Calculate balance
6. Group expenses by category
7. Find monthly transactions
8. Join users with transactions

## Run the Angular Frontend

Open a terminal in the Angular project folder:

```bash
npm install
ng serve
```

Open http://localhost:4200 in your browser.

## Run the Spring Boot Backend

Configure your MySQL database connection using your local configuration.

Run the application from your IDE or use:

```bash
mvn spring-boot:run
```

## Security

- Do not upload database passwords or other secrets to GitHub.
- Store passwords using secure hashing.
- Validate input on the backend.
- Ensure users can access only their authorized transactions.

## Version Control

```bash
git status
git add .
git commit -m "Update project documentation"
git push
```

## Author

SpendWise - Personal Expense Tracker