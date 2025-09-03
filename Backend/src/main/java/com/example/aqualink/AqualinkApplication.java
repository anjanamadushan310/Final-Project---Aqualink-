package com.example.aqualink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.example.aqualink.entity")
public class AqualinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(AqualinkApplication.class, args);
	}

}
