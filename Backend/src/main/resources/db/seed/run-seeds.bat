@echo off
REM AquaLink Database Seed Loader (Simple Version)
REM This batch file runs all seed SQL files in order

echo ========================================
echo   AquaLink Database Seed Loader
echo ========================================
echo.

REM Configuration - EDIT THESE VALUES
set DB_USER=postgres
set DB_NAME=aqualink_db
set DB_HOST=localhost
set DB_PORT=5432

echo Database: %DB_NAME%
echo User: %DB_USER%
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo.

set /p CONFIRM="Continue with seeding? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Seed operation cancelled.
    exit /b 0
)

echo.
echo Starting seed process...
echo.

REM Set password (you'll be prompted)
set /p PGPASSWORD="Enter PostgreSQL password for %DB_USER%: "

REM Run each seed file
echo [1/10] Loading users...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 01_users.sql
if errorlevel 1 goto error

echo [2/10] Loading user roles...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 02_user_roles.sql
if errorlevel 1 goto error

echo [3/10] Loading user profiles...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 03_user_profiles.sql
if errorlevel 1 goto error

echo [4/10] Loading fish ads...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 04_fish_ads.sql
if errorlevel 1 goto error

echo [5/10] Loading industrial stuff...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 05_industrial_stuff.sql
if errorlevel 1 goto error

echo [6/10] Loading services...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 06_services.sql
if errorlevel 1 goto error

echo [7/10] Loading blog posts...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 07_blog_posts.sql
if errorlevel 1 goto error

echo [8/10] Loading blog comments...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 08_blog_comments.sql
if errorlevel 1 goto error

echo [9/10] Loading delivery coverage...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 09_delivery_coverage.sql
if errorlevel 1 goto error

echo [10/10] Loading banners...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f 10_banners.sql
if errorlevel 1 goto error

echo.
echo ========================================
echo   SUCCESS! All seeds loaded
echo ========================================
echo.
echo Test accounts (all use password: password123):
echo   Admin: admin@aqualink.com
echo   Shop Owner: lakshitha@shop.com
echo   Farm Owner: sunil@farm.com
echo   Delivery: kasun@delivery.com
echo.
echo See README.md for complete account list
echo.
goto end

:error
echo.
echo ========================================
echo   ERROR: Seed loading failed!
echo ========================================
echo.
echo Check the error message above
echo.

:end
pause
