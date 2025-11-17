# Database Seeding

## Overview
The AquaLink application uses a Java-based database seeder that automatically populates test data when the application starts.

## How It Works
- **Location**: `src/main/java/com/example/aqualink/config/DatabaseSeeder.java`
- **Type**: Spring Boot `CommandLineRunner`
- **Trigger**: Runs automatically on application startup
- **Idempotent**: Only seeds data if database is empty (checks user count)

## What Gets Seeded

### 16 Test Users (All roles)
- **Admin**: admin@aqualink.com / admin@12345
- **Shop Owners**: 
  - kamal@shop.com / password123
  - nimal@shop.com / password123
- **Farm Owners**:
  - sunil@farm.com / password123
  - chandana@farm.com / password123
- **Exporters**:
  - pradeep@export.com / password123
  - lakshman@export.com / password123
- **Service Providers**:
  - ravi@service.com / password123
  - anjana@service.com / password123
- **Industrial Stuff Sellers**:
  - mahesh@industrial.com / password123
  - kumara@industrial.com / password123
- **Delivery Persons**:
  - dinesh@delivery.com / password123
  - ruwan@delivery.com / password123
- **Regular Users**:
  - saman@user.com / password123
  - hasini@user.com / password123
  - thilini@user.com / password123
  - kasun@user.com / password123

### Related Data
- **User Profiles**: Business details for all users
- **Fish Ads**: Sample fish listings from farm owners
- **Industrial Equipment**: Aquaculture equipment from sellers
- **Services**: 9 services (aquarium setup, maintenance, consultation, etc.)
- **Blog Posts**: Sample blog articles
- **Delivery Coverage**: Coverage areas for delivery persons
- **Banners**: 5 promotional banners

## Running the Seeder

### Automatic (Default)
Just start the Spring Boot application:
```bash
.\mvnw.cmd spring-boot:run
```

The seeder will automatically run if the database is empty.

### Forcing a Re-seed
1. Clear the database:
   ```sql
   DROP DATABASE aqualinkfinel24;
   CREATE DATABASE aqualinkfinel24;
   ```

2. Restart the application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

## Verification

Check the console logs for:
```
🌱 Starting database seeding...
Seeding users...
✅ Created 16 test users
Seeding user profiles...
✅ Created user profiles
Seeding fish ads...
✅ Created fish ads
...
✅ Database seeding completed successfully!
```

## Database Configuration
- **Database**: MySQL 8
- **Connection**: jdbc:mysql://localhost:3306/aqualinkfinel24
- **Username**: root
- **Password**: ASD236asd

## Notes
- All passwords are BCrypt encoded
- All seeded items have APPROVED/VERIFIED status for immediate testing
- The seeder is transactional - if any part fails, nothing is saved
- Duplicate seeding is prevented by checking if users already exist
