# AquaLink Database Seeds - Summary

## ✅ What Was Created

I've created a complete database seed system for your AquaLink project with 10 SQL seed files, scripts, and documentation.

### 📁 Seed Files Created

All files are in: `Backend/src/main/resources/db/seed/`

1. **00_master_seed.sql** - Master script (runs all seeds)
2. **01_users.sql** - 16 user accounts with different roles
3. **02_user_roles.sql** - Role assignments
4. **03_user_profiles.sql** - User profile information
5. **04_fish_ads.sql** - 10 fish products
6. **05_industrial_stuff.sql** - 12 industrial equipment items
7. **06_services.sql** - 9 service offerings
8. **07_blog_posts.sql** - 5 blog posts
9. **08_blog_comments.sql** - 15 blog comments
10. **09_delivery_coverage.sql** - 11 delivery coverage areas
11. **10_banners.sql** - 5 homepage banners

### 🛠️ Runner Scripts

- **run-seeds.bat** - Simple Windows batch file (double-click to run)
- **run-seeds.ps1** - PowerShell script with error handling
- **README.md** - Complete documentation
- **SEED_QUICK_START.md** - Quick reference guide (in Backend folder)

## 📊 Seed Data Contents

### Users (16 total)
- 1 Admin
- 2 Shop Owners
- 2 Farm Owners  
- 2 Exporters
- 2 Service Providers
- 2 Industrial Stuff Sellers
- 3 Delivery Persons
- 2 Regular Customers

**All passwords: `password123`**

### Products & Services
- 10 Fish varieties (Tilapia, Catfish, Koi, Gourami, etc.)
- 12 Equipment items (Filters, Aerators, Testing kits, etc.)
- 9 Services (Setup, Maintenance, Consultation, etc.)

### Content
- 5 Educational blog posts
- 15 Community comments
- 11 Delivery coverage areas (Colombo, Gampaha, Kalutara)
- 5 Homepage promotional banners

## 🚀 How to Use

### Quick Start (Windows)

1. Open File Explorer
2. Navigate to: `Backend\src\main\resources\db\seed\`
3. Double-click `run-seeds.bat`
4. Enter your PostgreSQL password
5. Done! ✅

### PowerShell
```powershell
cd Backend\src\main\resources\db\seed
.\run-seeds.bat
```

### Manual psql
```powershell
cd Backend\src\main\resources\db\seed
psql -U postgres -d aqualink_db -f 01_users.sql
psql -U postgres -d aqualink_db -f 02_user_roles.sql
# ... continue for all files
```

## 🔑 Test Login Accounts

| Role | Email | Password | Business |
|------|-------|----------|----------|
| **Admin** | admin@aqualink.com | password123 | System Admin |
| **Shop Owner** | lakshitha@shop.com | password123 | Lakshitha Fish Market |
| **Farm Owner** | sunil@farm.com | password123 | Sunil Aqua Farm |
| **Exporter** | pradeep@export.com | password123 | Pradeep Export Traders |
| **Service Provider** | ravi@service.com | password123 | Ravi Aquarium Services |
| **Industrial Seller** | mahesh@industrial.com | password123 | Mahesh Equipment Supplies |
| **Delivery Person** | kasun@delivery.com | password123 | Kasun Quick Delivery |
| **Customer** | nuwan@customer.com | password123 | Regular User |

More accounts available - see README.md for complete list.

## 🎯 Multi-Role Testing

Some users have multiple roles:
- **sunil@farm.com** - FARM_OWNER + EXPORTER
- **lakshitha@shop.com** - SHOP_OWNER + SERVICE_PROVIDER

Perfect for testing the profile menu with many dashboard options! 😉

## ✨ Features

✅ All users are pre-verified (APPROVED status)
✅ All products are pre-approved (visible immediately)
✅ Realistic Sri Lankan locations and names
✅ Ready-to-test delivery coverage
✅ Sample blog content with community engagement
✅ Foreign key relationships maintained
✅ Auto-increment sequences properly set

## 🧹 Clearing Database

Before re-running seeds, clear existing data:

```sql
-- Run this in psql
TRUNCATE TABLE blog_comments CASCADE;
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

## ✅ Verification

After seeding, verify:

```sql
SELECT COUNT(*) FROM users;  -- 16
SELECT COUNT(*) FROM fish_ads;  -- 10
SELECT COUNT(*) FROM industrial_stuff;  -- 12
SELECT COUNT(*) FROM services;  -- 9
SELECT COUNT(*) FROM blog_posts;  -- 5
SELECT COUNT(*) FROM blog_comments;  -- 15

-- See all users with roles
SELECT u.name, u.email, ur.role_name 
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
ORDER BY u.id;
```

## 📚 Documentation

- **Backend/src/main/resources/db/seed/README.md** - Detailed guide
- **Backend/SEED_QUICK_START.md** - Quick reference
- **This file** - Summary overview

## ⚠️ Important Notes

1. **Development Only** - Do NOT use in production
2. **Password Security** - All use the same test password
3. **Order Matters** - Files must run in sequence (01, 02, 03...)
4. **Clean Database** - Works best on empty database
5. **PostgreSQL Required** - Scripts are PostgreSQL-specific

## 🎉 Ready to Test!

You now have a fully populated database with:
- Multiple user types to test different dashboards
- Products to browse and purchase
- Services to book
- Blog content to read and comment on
- Delivery options to test checkout flow
- Everything you need for comprehensive testing!

## 🐛 Troubleshooting

**psql not found?**
Add PostgreSQL to PATH:
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"
```

**Database doesn't exist?**
```sql
createdb -U postgres aqualink_db
```

**Duplicate key errors?**
Clear the database first (see "Clearing Database" section above)

---

**Questions?** Check the README.md files or ask for help!

**Enjoy testing your AquaLink application! 🐟💧**
