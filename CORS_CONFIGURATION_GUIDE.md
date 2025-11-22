# 🌐 CORS Configuration Guide

## ✅ What Was Changed

All `@CrossOrigin` annotations have been **removed** from 19 controllers and **centralized** in `SecurityConfig.java`.

## 📝 Configuration Location

### Backend Configuration File
**File:** `Backend/src/main/resources/application.properties`

```properties
# CORS Configuration
# For development - local origins
cors.allowed.origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

### Security Configuration
**File:** `Backend/src/main/java/com/example/aqualink/security/config/SecurityConfig.java`

The `SecurityConfig` class now reads CORS origins from the property file:

```java
@Value("${cors.allowed.origins:http://localhost:5173,http://localhost:3000}")
private String allowedOrigins;
```

## 🚀 How to Deploy to Production

### Option 1: Environment Variable (Recommended)
Set the `CORS_ALLOWED_ORIGINS` environment variable before starting the application:

```bash
# Linux/Mac
export CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com"

# Windows
set CORS_ALLOWED_ORIGINS=https://aqualink.com,https://www.aqualink.com

# Docker
docker run -e CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com" your-image

# Kubernetes
env:
  - name: CORS_ALLOWED_ORIGINS
    value: "https://aqualink.com,https://www.aqualink.com"
```

### Option 2: Production Properties File
Create `application-prod.properties`:

```properties
cors.allowed.origins=https://aqualink.com,https://www.aqualink.com
```

Then run with production profile:
```bash
java -jar aqualink.jar --spring.profiles.active=prod
```

### Option 3: Cloud Platform Specific

**AWS Elastic Beanstalk:**
```bash
eb setenv CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com"
```

**Heroku:**
```bash
heroku config:set CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com"
```

**Azure App Service:**
```bash
az webapp config appsettings set --name YourAppName --resource-group YourResourceGroup \
  --settings CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com"
```

**Google Cloud Run:**
```bash
gcloud run deploy aqualink \
  --set-env-vars CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com"
```

## 📋 Controllers Updated (19 Total)

✅ All these controllers now use centralized CORS configuration:

1. AdminController
2. AdminServiceController
3. BannerController
4. CartController
5. DeliveryPersonController
6. DeliveryQuoteController
7. FileController
8. FishAdsApproveController
9. FishAdsCreateController
10. FishAdsViewController
11. IndustrialStuffApproveController
12. IndustrialStuffCreateController
13. IndustrialStuffViewController
14. OrderController
15. ServiceController
16. ServiceProviderController
17. ShopOwnerController
18. TestController
19. UserProfileController

## ✨ Benefits

### Before:
```java
// ❌ Had to change in EVERY controller
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/something")
public class SomeController { ... }
```

### After:
```java
// ✅ No @CrossOrigin needed - managed centrally
@RestController
@RequestMapping("/api/something")
public class SomeController { ... }
```

**Advantages:**
- ✅ **Single source of truth** - change CORS in one place
- ✅ **Environment-specific** - different origins for dev/staging/production
- ✅ **No code changes** - just set environment variable
- ✅ **Multiple origins** - comma-separated list support
- ✅ **Secure** - explicit headers, credentials support, caching

## 🔒 Current CORS Settings

```java
// Allowed HTTP Methods
GET, POST, PUT, DELETE, OPTIONS

// Allowed Headers
Authorization, Content-Type, Accept, X-Requested-With

// Allow Credentials
true (required for JWT tokens)

// Preflight Cache
3600 seconds (1 hour)
```

## 🧪 Testing CORS

### Development:
```bash
# Should work by default
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:8080/api/fish
```

### Production:
```bash
# Set your production origin
export CORS_ALLOWED_ORIGINS="https://aqualink.com"

# Restart application
./mvnw spring-boot:run
```

## ⚠️ Important Notes

1. **Comma-separated list**: Multiple origins must be separated by commas with NO spaces
   - ✅ `http://localhost:5173,http://localhost:3000`
   - ❌ `http://localhost:5173, http://localhost:3000` (space causes issues)

2. **Protocol matters**: Include `http://` or `https://`
   - ✅ `https://aqualink.com`
   - ❌ `aqualink.com`

3. **No trailing slashes**: Don't add `/` at the end
   - ✅ `https://aqualink.com`
   - ❌ `https://aqualink.com/`

4. **Subdomains**: Each subdomain needs separate entry
   - Include both: `https://aqualink.com,https://www.aqualink.com`

## 🔄 Migration Checklist

- [x] Removed all `@CrossOrigin` annotations from controllers (19 files)
- [x] Added `cors.allowed.origins` property to application.properties
- [x] Updated SecurityConfig to use @Value injection
- [x] Updated corsConfigurationSource() method
- [x] Tested with default development origins
- [ ] Set production environment variable before deployment
- [ ] Verify CORS works in production
- [ ] Document production URLs in deployment guide

## 📞 Deployment Examples

### Example 1: Single Frontend Domain
```bash
export CORS_ALLOWED_ORIGINS="https://aqualink.com"
```

### Example 2: Multiple Domains (www + apex)
```bash
export CORS_ALLOWED_ORIGINS="https://aqualink.com,https://www.aqualink.com"
```

### Example 3: Multiple Environments
```bash
# Staging + Production
export CORS_ALLOWED_ORIGINS="https://staging.aqualink.com,https://aqualink.com"
```

### Example 4: CDN + Main Domain
```bash
export CORS_ALLOWED_ORIGINS="https://cdn.aqualink.com,https://aqualink.com"
```

---

**Last Updated:** Security Audit - CORS Centralization  
**Status:** ✅ Complete - Ready for Production Deployment
