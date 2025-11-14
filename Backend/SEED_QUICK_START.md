# Quick Start: Database Seeds

This guide helps you quickly populate your AquaLink database with test data.

## What You Get

After running the seeds, you'll have:
- ✅ 16 test user accounts with different roles
- ✅ 10 fish products (Tilapia, Catfish, Koi, etc.)
- ✅ 12 industrial equipment items
- ✅ 9 services (aquarium setup, consulting, etc.)
- ✅ 5 blog posts with 15 comments
- ✅ Delivery coverage for Colombo, Gampaha, Kalutara
- ✅ 5 homepage banners

**All users use password: `password123`**

## Running the Seeds (Windows)

### Method 1: Double-click (Easiest)
1. Navigate to: `Backend\src\main\resources\db\seed\`
2. Double-click `run-seeds.bat`
3. Enter your PostgreSQL password when prompted
4. Wait for completion

### Method 2: PowerShell
```powershell
cd Backend\src\main\resources\db\seed
.\run-seeds.ps1
```

### Method 3: Manual psql
```powershell
cd Backend\src\main\resources\db\seed

# Edit these values for your setup
$env:PGPASSWORD = "your_password"
psql -U postgres -d aqualink_db -f 01_users.sql
psql -U postgres -d aqualink_db -f 02_user_roles.sql
psql -U postgres -d aqualink_db -f 03_user_profiles.sql
psql -U postgres -d aqualink_db -f 04_fish_ads.sql
psql -U postgres -d aqualink_db -f 05_industrial_stuff.sql
psql -U postgres -d aqualink_db -f 06_services.sql
psql -U postgres -d aqualink_db -f 07_blog_posts.sql
psql -U postgres -d aqualink_db -f 08_blog_comments.sql
psql -U postgres -d aqualink_db -f 09_delivery_coverage.sql
psql -U postgres -d aqualink_db -f 10_banners.sql
```

## Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aqualink.com | password123 |
| Shop Owner | lakshitha@shop.com | password123 |
| Farm Owner | sunil@farm.com | password123 |
| Exporter | pradeep@export.com | password123 |
| Service Provider | ravi@service.com | password123 |
| Industrial Seller | mahesh@industrial.com | password123 |
| Delivery Person | kasun@delivery.com | password123 |
| Customer | nuwan@customer.com | password123 |

See `Backend/src/main/resources/db/seed/README.md` for the complete list.

## Clearing Database Before Seeding

If you need to start fresh:

```sql
-- Connect to your database first
psql -U postgres -d aqualink_db

-- Then run this (WARNING: Deletes all data!)
TRUNCATE TABLE blog_comments CASCADE;
TRUNCATE TABLE blog_reactions CASCADE;
TRUNCATE TABLE blog_posts CASCADE;
TRUNCATE TABLE delivery_person_coverage CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE industrial_stuff CASCADE;
TRUNCATE TABLE fish_ads CASCADE;
TRUNCATE TABLE user_profile CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE banner CASCADE;
```

## Verifying Seeds

After running seeds, verify with:

```sql
-- Connect to database
psql -U postgres -d aqualink_db

-- Check counts
SELECT COUNT(*) as user_count FROM users;  -- Should be 16
SELECT COUNT(*) as fish_count FROM fish_ads;  -- Should be 10
SELECT COUNT(*) as equipment_count FROM industrial_stuff;  -- Should be 12
SELECT COUNT(*) as service_count FROM services;  -- Should be 9
SELECT COUNT(*) as blog_count FROM blog_posts;  -- Should be 5

-- See all users and their roles
SELECT u.email, u.name, ur.role_name 
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
ORDER BY u.id;
```

## Troubleshooting

### "psql: command not found"
Add PostgreSQL to your PATH:
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"
```
(Adjust version number to match your installation)

### "database does not exist"
Create the database first:
```sql
createdb -U postgres aqualink_db
```

### Duplicate key errors
The database already has data. Either clear it first or skip seeding.

### Permission denied
Ensure you're using a PostgreSQL user with sufficient privileges.

## Need Help?

See the detailed documentation:
- `Backend/src/main/resources/db/seed/README.md` - Complete seed documentation
- `Backend/TEST_DATA_README.md` - This file

---

**⚠️ IMPORTANT:** These seeds are for development/testing only. Do NOT use in production!
