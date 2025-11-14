# Database Seed Data Documentation

## Overview
This directory contains seed data for the AquaLink project. The seed scripts populate the database with sample data for testing and development purposes.

## Password Information
**All user accounts use the password: `password123`**
- The password is hashed using BCrypt with strength 10
- Hash: `$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi`

## Seed Data Contents

### Users (16 total)
1. **Admin User** (admin@aqualink.com)
   - Role: ADMIN
   - Full system access

2. **Shop Owners** (2 users)
   - lakshitha@shop.com - Lakshitha Fish Market
   - nimal@shop.com - Nimal Seafood Center

3. **Farm Owners** (2 users)
   - sunil@farm.com - Sunil Aqua Farm
   - kamal@farm.com - Kamal Fish Hatchery

4. **Exporters** (2 users)
   - pradeep@export.com - Pradeep Export Traders
   - chandana@export.com - Chandana Global Exports

5. **Service Providers** (2 users)
   - ravi@service.com - Ravi Aquarium Services
   - anjana@service.com - Anjana Pond Consulting

6. **Industrial Stuff Sellers** (2 users)
   - mahesh@industrial.com - Mahesh Equipment Supplies
   - tharaka@industrial.com - Tharaka Aqua Tech

7. **Delivery Persons** (3 users)
   - kasun@delivery.com - Kasun Quick Delivery (Colombo)
   - dinesh@delivery.com - Dinesh Express Transport (Gampaha)
   - ruwan@delivery.com - Ruwan Island Delivery (Kalutara)

8. **Regular Customers** (2 users)
   - nuwan@customer.com
   - samantha@customer.com

### Products & Services
- **10 Fish Ads** - Various fish species from Tilapia to Koi
- **12 Industrial Equipment** - Aquarium filters, aerators, testing kits, etc.
- **9 Services** - Aquarium setup, maintenance, consultation, etc.

### Content
- **5 Blog Posts** - Educational content about fish farming and aquaculture
- **15 Blog Comments** - Sample comments and discussions
- **11 Delivery Coverage Areas** - Coverage for Colombo, Gampaha, and Kalutara districts
- **5 Banners** - Homepage promotional banners

## How to Run Seeds

### Option 1: PostgreSQL Command Line
Navigate to the seed directory and run:
```bash
cd Backend/src/main/resources/db/seed
psql -U your_username -d aqualink_db -f 00_master_seed.sql
```

### Option 2: Individual Files
Run each file in order:
```bash
psql -U your_username -d aqualink_db -f 01_users.sql
psql -U your_username -d aqualink_db -f 02_user_roles.sql
# ... continue with remaining files
```

### Option 3: Windows PowerShell
```powershell
cd 'Backend\src\main\resources\db\seed'
Get-Content 01_users.sql | & psql -U your_username -d aqualink_db
Get-Content 02_user_roles.sql | & psql -U your_username -d aqualink_db
# ... continue with remaining files
```

### Option 4: Using pgAdmin
1. Open pgAdmin
2. Connect to your database
3. Open Query Tool
4. Load each SQL file and execute in order

## Before Running Seeds

### Prerequisites
1. Database should be created: `aqualink_db`
2. All tables should be created (run migrations first)
3. Database should be empty or you may get duplicate key errors

### Clear Existing Data (Optional)
If you need to reset the database before seeding:
```sql
-- WARNING: This will delete all data!
TRUNCATE TABLE blog_comments CASCADE;
TRUNCATE TABLE blog_reactions CASCADE;
TRUNCATE TABLE blog_posts CASCADE;
TRUNCATE TABLE delivery_person_coverage CASCADE;
TRUNCATE TABLE delivery_person_availability CASCADE;
TRUNCATE TABLE service_bookings CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE industrial_stuff CASCADE;
TRUNCATE TABLE fish_images CASCADE;
TRUNCATE TABLE fish_ads CASCADE;
TRUNCATE TABLE cart_item CASCADE;
TRUNCATE TABLE cart CASCADE;
TRUNCATE TABLE order_item CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE delivery_quotes CASCADE;
TRUNCATE TABLE delivery_quote_requests CASCADE;
TRUNCATE TABLE review CASCADE;
TRUNCATE TABLE service_review CASCADE;
TRUNCATE TABLE banner CASCADE;
TRUNCATE TABLE user_profile CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE fish_ads_id_seq RESTART WITH 1;
ALTER SEQUENCE industrial_stuff_id_seq RESTART WITH 1;
ALTER SEQUENCE services_id_seq RESTART WITH 1;
ALTER SEQUENCE blog_posts_id_seq RESTART WITH 1;
ALTER SEQUENCE blog_comments_id_seq RESTART WITH 1;
ALTER SEQUENCE delivery_person_coverage_id_seq RESTART WITH 1;
ALTER SEQUENCE banner_id_seq RESTART WITH 1;
```

## Seed File Order
The files must be run in this specific order due to foreign key constraints:

1. **01_users.sql** - Base user accounts
2. **02_user_roles.sql** - User role assignments
3. **03_user_profiles.sql** - User profile details
4. **04_fish_ads.sql** - Fish products
5. **05_industrial_stuff.sql** - Industrial equipment
6. **06_services.sql** - Service offerings
7. **07_blog_posts.sql** - Blog content
8. **08_blog_comments.sql** - Blog comments
9. **09_delivery_coverage.sql** - Delivery coverage areas
10. **10_banners.sql** - Homepage banners

## Testing the Seeds

After running the seeds, verify the data:

```sql
-- Check user count
SELECT COUNT(*) FROM users;  -- Should return 16

-- Check roles
SELECT u.email, ur.role_name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
ORDER BY u.id;

-- Check products
SELECT COUNT(*) FROM fish_ads;  -- Should return 10
SELECT COUNT(*) FROM industrial_stuff;  -- Should return 12
SELECT COUNT(*) FROM services;  -- Should return 9

-- Check blog content
SELECT COUNT(*) FROM blog_posts;  -- Should return 5
SELECT COUNT(*) FROM blog_comments;  -- Should return 15
```

## Login Credentials for Testing

You can use any of these accounts to test different user roles:

| Role | Email | Password | Business Name |
|------|-------|----------|---------------|
| Admin | admin@aqualink.com | password123 | - |
| Shop Owner | lakshitha@shop.com | password123 | Lakshitha Fish Market |
| Farm Owner | sunil@farm.com | password123 | Sunil Aqua Farm |
| Exporter | pradeep@export.com | password123 | Pradeep Export Traders |
| Service Provider | ravi@service.com | password123 | Ravi Aquarium Services |
| Industrial Seller | mahesh@industrial.com | password123 | Mahesh Equipment Supplies |
| Delivery Person | kasun@delivery.com | password123 | Kasun Quick Delivery |
| Customer | nuwan@customer.com | password123 | - |

## Multi-Role Testing
Some users have multiple roles for testing:
- **sunil@farm.com** - FARM_OWNER + EXPORTER
- **lakshitha@shop.com** - SHOP_OWNER + SERVICE_PROVIDER

## Notes
- All users are pre-verified (verification_status = 'APPROVED')
- All users are active (active = true)
- Product statuses are set to 'APPROVED' for immediate visibility
- Image paths in banners may need to be updated based on your actual image assets
- Delivery charges vary by district (Rs. 40-50 per km)

## Troubleshooting

### Foreign Key Violations
If you get foreign key errors, ensure you're running the files in the correct order.

### Duplicate Key Errors
If you get duplicate key errors, the database already has data. Either clear it first or skip the seed.

### Sequence Issues
If auto-increment IDs are not working after seeding, run the ALTER SEQUENCE commands at the end of each file.

### Connection Errors
Ensure your PostgreSQL server is running and you have the correct connection details in `application.properties`.

## Development vs Production

**⚠️ IMPORTANT:** These seeds are for **development and testing only**. 

Do NOT run these seeds in a production environment because:
- They use a well-known password
- They contain test data
- They may overwrite existing data

For production, create a separate set of seeds with:
- Strong, unique passwords
- Real business data
- Proper security considerations
