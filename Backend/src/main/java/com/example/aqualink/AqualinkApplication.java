package com.example.aqualink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EntityScan("com.example.aqualink.entity")
public class AqualinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(AqualinkApplication.class, args);
	}

	@Configuration
	public static class WebConfig implements WebMvcConfigurer {
		@Override
		public void addResourceHandlers(ResourceHandlerRegistry registry) {
			registry.addResourceHandler("/uploads/**")
					.addResourceLocations("file:uploads/");
		}
	}

}
