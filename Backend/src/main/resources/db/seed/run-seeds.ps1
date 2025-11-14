# AquaLink Database Seed Script for Windows PowerShell
# This script loads all seed data into the PostgreSQL database

param(
    [string]$DbUser = "postgres",
    [string]$DbName = "aqualink_db",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AquaLink Database Seed Loader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
} catch {
    Write-Host "ERROR: psql command not found!" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed and psql is in your PATH" -ForegroundColor Yellow
    Write-Host "Typical location: C:\Program Files\PostgreSQL\<version>\bin\" -ForegroundColor Yellow
    exit 1
}

Write-Host "Database Configuration:" -ForegroundColor Green
Write-Host "  Host: $DbHost" -ForegroundColor White
Write-Host "  Port: $DbPort" -ForegroundColor White
Write-Host "  Database: $DbName" -ForegroundColor White
Write-Host "  User: $DbUser" -ForegroundColor White
Write-Host ""

# Confirm before proceeding
$confirmation = Read-Host "This will insert seed data into the database. Continue? (Y/N)"
if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host "Seed operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Change to the seed directory
$seedDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $seedDir

Write-Host ""
Write-Host "Starting seed process..." -ForegroundColor Cyan
Write-Host ""

# Array of seed files in order
$seedFiles = @(
    "01_users.sql",
    "02_user_roles.sql",
    "03_user_profiles.sql",
    "04_fish_ads.sql",
    "05_industrial_stuff.sql",
    "06_services.sql",
    "07_blog_posts.sql",
    "08_blog_comments.sql",
    "09_delivery_coverage.sql",
    "10_banners.sql"
)

$successCount = 0
$failCount = 0

foreach ($file in $seedFiles) {
    if (Test-Path $file) {
        Write-Host "[Processing] $file..." -ForegroundColor Yellow -NoNewline
        
        try {
            # Run the SQL file
            $env:PGPASSWORD = Read-Host "Enter password for $DbUser" -AsSecureString
            $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD)
            $env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
            
            $result = & psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $file 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✓ SUCCESS" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host " ✗ FAILED" -ForegroundColor Red
                Write-Host "Error: $result" -ForegroundColor Red
                $failCount++
            }
        } catch {
            Write-Host " ✗ FAILED" -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host "[MISSING] $file - File not found" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Seed Process Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Success: $successCount files" -ForegroundColor Green
Write-Host "Failed: $failCount files" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "✓ All seed data loaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now login with any of these accounts:" -ForegroundColor Cyan
    Write-Host "  Admin: admin@aqualink.com / password123" -ForegroundColor White
    Write-Host "  Shop Owner: lakshitha@shop.com / password123" -ForegroundColor White
    Write-Host "  Farm Owner: sunil@farm.com / password123" -ForegroundColor White
    Write-Host "  See README.md for complete list of test accounts" -ForegroundColor Yellow
} else {
    Write-Host "⚠ Some seed files failed to load. Check errors above." -ForegroundColor Yellow
}

Write-Host ""
