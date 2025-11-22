# 🔍 403 Forbidden Error - Troubleshooting Guide

## Error Summary

**Error:** `HTTP error! status: 403`  
**Endpoint:** `/api/delivery-quotes/order/{orderId}/quotes`  
**Location:** QuoteAcceptance.jsx → deliveryService.getQuotesForOrder()

---

## 🎯 Root Cause Analysis

A **403 Forbidden** error means:
- ✅ **Authentication succeeded** (your token is valid)
- ❌ **Authorization failed** (you don't have the required role/permission)

### Backend Authorization Requirements

The endpoint requires one of these roles:
```java
@PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
```

**File:** `Backend/src/main/java/com/example/aqualink/controller/DeliveryQuoteController.java` (Line 99)

---

## 🔧 Debugging Steps

### Step 1: Check Browser Console

The updated code now logs authentication details:

```javascript
Auth Token: eyJhbGciOiJIUzI1Ni... (first 20 chars)
User from context: { email: "...", roles: [...] }
User roles: ["SHOP_OWNER"]
Required roles: SHOP_OWNER, FARM_OWNER, or INDUSTRIAL_STUFF_SELLER
```

**What to check:**
1. **Token exists** - Is there a token shown?
2. **User object** - Does it contain user data?
3. **User roles** - Are the roles present in the array?

### Step 2: Check Backend Logs

Look for JWT filter logs in your backend console:

```
JWT Filter: Processing request to /api/delivery-quotes/order/123/quotes
JWT Filter: Authorization header = Bearer eyJ...
JWT Filter: Extracted JWT token
JWT Filter: Extracted email = user@example.com, userId = 123
JWT Filter: Token validated successfully for user: user@example.com
JWT Filter: Authentication set successfully
```

**What to check:**
1. Is the token being extracted?
2. Is the email being parsed correctly?
3. Does token validation succeed?
4. Are roles being loaded from the user?

---

## 🐛 Common Issues & Solutions

### Issue 1: Token is Missing or NULL

**Symptom:** Console shows "NO TOKEN FOUND"

**Cause:** 
- User is not logged in
- Token was cleared from localStorage
- Login didn't save the token properly

**Solution:**
```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token:', token);

// If missing, user needs to log in again
if (!token) {
  // Redirect to login
  window.location.href = '/login';
}
```

### Issue 2: User Has Wrong Role

**Symptom:** Console shows user has role like "USER" or "ADMIN" instead of required roles

**Cause:**
- User registered with wrong role
- Admin hasn't approved the role change
- Database has incorrect role assignment

**Solution:**
```sql
-- Check user roles in database
SELECT u.email, r.name 
FROM user u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN role r ON ur.role_id = r.id 
WHERE u.email = 'your-email@example.com';

-- Expected result: SHOP_OWNER, FARM_OWNER, or INDUSTRIAL_STUFF_SELLER
```

### Issue 3: JWT Token Expired

**Symptom:** 401 error before 403, or token validation fails

**Cause:**
- Token has expired (default: 24 hours from `application.properties`)
- System clock mismatch

**Solution:**
```javascript
// Add token refresh logic
const refreshToken = async () => {
  // Re-login or implement refresh token mechanism
  const token = localStorage.getItem('token');
  
  // Decode token to check expiration
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = new Date(payload.exp * 1000);
  
  console.log('Token expires at:', expiry);
  
  if (Date.now() >= payload.exp * 1000) {
    alert('Your session has expired. Please log in again.');
    window.location.href = '/login';
  }
};
```

### Issue 4: CORS or Network Issue

**Symptom:** No request shown in Network tab, or CORS error before 403

**Cause:**
- Backend CORS not configured for frontend URL
- Backend not running

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8080/api/auth/login

# Check CORS configuration in application.properties
cors.allowed.origins=http://localhost:5173

# Restart backend after changes
./mvnw spring-boot:run
```

### Issue 5: Role Prefix Mismatch

**Symptom:** Backend logs show roles without "ROLE_" prefix

**Cause:**
- Spring Security expects "ROLE_" prefix
- JWT or database stores role without prefix

**Solution:**

Check `JwtAuthFilter.java` line 142:
```java
user.getRoles().stream()
    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
    .toList()
```

Ensure roles in JWT have format: `ROLE_SHOP_OWNER`

---

## ✅ Verification Checklist

Before accessing the QuoteAcceptance page:

- [ ] User is logged in (token exists in localStorage)
- [ ] User has one of: SHOP_OWNER, FARM_OWNER, INDUSTRIAL_STUFF_SELLER role
- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] CORS is configured: `cors.allowed.origins=http://localhost:5173`
- [ ] Order exists with valid orderId
- [ ] Token is not expired (check exp claim in JWT)

---

## 🔬 Manual Testing

### Test 1: Verify Token Contains Roles

```javascript
// In browser console
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('JWT Payload:', payload);
console.log('Roles in token:', payload.roles);
// Expected: ["SHOP_OWNER"] or ["FARM_OWNER"] or ["INDUSTRIAL_STUFF_SELLER"]
```

### Test 2: Test Endpoint Directly

```bash
# Get your token from localStorage
TOKEN="your-jwt-token-here"
ORDER_ID=123

# Test the endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/delivery-quotes/order/$ORDER_ID/quotes

# Expected: 200 OK with quotes array
# If 403: Check token roles
# If 401: Token invalid/expired
```

### Test 3: Check User in Database

```sql
-- Connect to your database
SELECT 
  u.id,
  u.email,
  u.name,
  GROUP_CONCAT(r.name) as roles
FROM user u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN role r ON ur.role_id = r.id
WHERE u.email = 'your-email@example.com'
GROUP BY u.id;
```

---

## 🛠️ Quick Fixes

### Fix 1: Re-login to Get Fresh Token

```javascript
// In browser console or in code
localStorage.clear();
window.location.href = '/login';
// Login again with SHOP_OWNER account
```

### Fix 2: Manually Add Role (Database)

```sql
-- Find user ID
SELECT id FROM user WHERE email = 'user@example.com';

-- Find role ID for SHOP_OWNER
SELECT id FROM role WHERE name = 'SHOP_OWNER';

-- Add role to user
INSERT INTO user_roles (user_id, role_id) 
VALUES (1, 2); -- Replace with actual IDs

-- Verify
SELECT u.email, r.name 
FROM user u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN role r ON ur.role_id = r.id 
WHERE u.email = 'user@example.com';
```

### Fix 3: Update Backend to Log More Details

Add to `DeliveryQuoteController.java`:

```java
@GetMapping("/order/{orderId}/quotes")
@PreAuthorize("hasRole('SHOP_OWNER') or hasRole('FARM_OWNER') or hasRole('INDUSTRIAL_STUFF_SELLER')")
public ResponseEntity<List<DeliveryQuoteDTO>> getQuotesForOrder(
        @PathVariable Long orderId,
        Authentication authentication) {
    
    System.out.println("=== GET QUOTES FOR ORDER ===");
    System.out.println("Order ID: " + orderId);
    System.out.println("User: " + authentication.getName());
    System.out.println("Authorities: " + authentication.getAuthorities());
    System.out.println("===========================");
    
    String customerEmail = authentication.getName();
    List<DeliveryQuoteDTO> quotes = deliveryQuoteService.getQuotesForOrder(orderId, customerEmail);
    return ResponseEntity.ok(quotes);
}
```

---

## 📊 Expected vs Actual

### ✅ Expected Behavior

1. User logs in with SHOP_OWNER role
2. Token is stored in localStorage
3. User navigates to QuoteAcceptance page
4. Frontend sends request with `Authorization: Bearer {token}` header
5. Backend validates token
6. Backend checks user has SHOP_OWNER role
7. Backend returns quotes (200 OK)

### ❌ Actual Behavior (403 Error)

1. User logs in
2. Token is stored
3. User navigates to page
4. Request is sent with token
5. Token is valid ✅
6. **Role check fails** ❌
7. Backend returns 403 Forbidden

---

## 🎯 Resolution Steps

1. **Check frontend console** - Look for auth debug logs
2. **Check backend console** - Look for JWT filter logs
3. **Verify user role** - Check database or JWT payload
4. **Re-login if needed** - Get fresh token
5. **Contact admin** - If role is wrong, admin needs to update it

---

## 📞 Support Information

**Files Modified for Debugging:**
- ✅ `Frontend/src/components/shopowner/QuoteAcceptance.jsx` - Added auth logging
- ✅ `Frontend/src/services/deliveryService.js` - Added detailed error messages
- ✅ `Backend/src/main/java/com/example/aqualink/security/filter/JwtAuthFilter.java` - Has extensive logging

**Key Endpoints:**
- Login: `POST /api/auth/login`
- Get Quotes: `GET /api/delivery-quotes/order/{orderId}/quotes`

**Required Role:** `SHOP_OWNER` or `FARM_OWNER` or `INDUSTRIAL_STUFF_SELLER`

---

**Last Updated:** November 22, 2025  
**Status:** Debugging tools added, check console for details
