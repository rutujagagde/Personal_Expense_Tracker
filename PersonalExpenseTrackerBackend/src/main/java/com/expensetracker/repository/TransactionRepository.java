
package com.expensetracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.expensetracker.entity.Transaction;

@Repository
public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    // Get all transactions for a user
    List<Transaction> findByUserId(Long userId);

    // Get income or expense transactions for a user
    List<Transaction> findByUserIdAndType(Long userId, String type);

    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user.id = :userId
        AND (:category IS NULL OR :category = '' OR t.category = :category)
        AND (:type IS NULL OR :type = '' OR t.type = :type)
        AND (:startDate IS NULL OR t.transactionDate >= :startDate)
        AND (:endDate IS NULL OR t.transactionDate <= :endDate)
        ORDER BY t.transactionDate DESC
        """)
    List<Transaction> filterTransactions(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("type") String type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
