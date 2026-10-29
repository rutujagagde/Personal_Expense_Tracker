package com.expensetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PersonalExpenseTrackerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalExpenseTrackerBackendApplication.class, args);
		System.out.println("Programm started....");
	}

}
