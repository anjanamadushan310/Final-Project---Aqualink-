# 🎯 Frontend URL Refactoring Checklist

## ✅ Already Fixed (6 files)

1. ✅ **Frontend/src/config.js** - Updated to use environment variables
2. ✅ **Frontend/src/services/api.js** - Updated baseURL to use API_URL
3. ✅ **Frontend/src/pages/Login.jsx** - Updated login endpoint
4. ✅ **Frontend/src/components/RegistrationForm.jsx** - Updated all 4 URLs
5. ✅ **Frontend/src/pages/UserProfile.jsx** - Updated API_BASE_URL
6. ✅ **Frontend/src/utils/apiHelpers.js** - Created new helper utilities

## ⚠️ Remaining Files to Update (47 hardcoded URLs)

### Admin Components (8 URLs)

**Frontend/src/components/admin/ProductApprove.jsx**
```javascript
// Lines to update - search for localhost:8080
// Add: import { API_URL, getImageUrl } from '../../config';
// Replace all fetch/axios calls with API_URL
```

**Frontend/src/components/admin/ProductManagement.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
// Update: All /api/fish endpoints to use API_URL
```

**Frontend/src/components/admin/StuffManagement.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
// Update: All /api/industrial endpoints to use API_URL
```

**Frontend/src/components/admin/ServicesManagement.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
```

**Frontend/src/components/admin/BannerManagement.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
```

### Home Components (24 URLs)

**Frontend/src/components/home/FishSection.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
// Replace: 'http://localhost:8080/api/fish' → `${API_URL}/fish`
// Replace: `http://localhost:8080${imagePath}` → getImageUrl(imagePath)
```

**Frontend/src/components/home/IndustrialSection.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
// Replace: 'http://localhost:8080/api/industrial' → `${API_URL}/industrial`
```

**Frontend/src/components/home/ServicesSection.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
```

**Frontend/src/components/home/ServiceCard.jsx**
```javascript
// Add: import { getImageUrl } from '../../config';
// Replace: `http://localhost:8080${serviceImageUrl}` → getImageUrl(serviceImageUrl)
```

**Frontend/src/components/home/CompleteServiceCard.jsx**
```javascript
// Add: import { getImageUrl } from '../../config';
```

**Frontend/src/components/home/FishCard.jsx**
```javascript
// Add: import { getImageUrl } from '../../config';
// Replace: `http://localhost:8080${imagePath}` → getImageUrl(imagePath)
```

**Frontend/src/components/home/IndustrialStuffCard.jsx**
```javascript
// Add: import { getImageUrl } from '../../config';
```

**Frontend/src/components/home/ProductDetails.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
```

**Frontend/src/components/home/IndustrialProductDetails.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
```

**Frontend/src/components/home/IndustrialDetailsModal.jsx**
```javascript
// Add: import { API_URL, getImageUrl } from '../../config';
```

**Frontend/src/components/home/BannerCarousel.jsx**
```javascript
// Add: import { getImageUrl } from '../../config';
```

### Shop Owner Components (1 URL)

**Frontend/src/components/shopowner/MyBookings.jsx**
```javascript
// Add: import { API_URL } from '../../config';
```

### Farm Owner Components (2 URLs)

**Frontend/src/components/farmowner/FishAdsForm.jsx**
```javascript
// Add: import { API_URL } from '../../config';
// Replace: 'http://localhost:8080/api/fish' → `${API_URL}/fish`
```

**Frontend/src/components/farmowner/FishStockManagement.jsx**
```javascript
// Add: import { API_URL } from '../../config';
```

### Industrial Seller Components (1 URL)

**Frontend/src/components/industrialstuffseller/IndustrialStuffForm.jsx**
```javascript
// Add: import { API_URL } from '../../config';
// Replace: 'http://localhost:8080/api/industrial' → `${API_URL}/industrial`
```

### Service Provider Components (1 URL)

**Frontend/src/components/serviceprovider/ServiceAdsForm.jsx**
```javascript
// Add: import { API_URL } from '../../config';
```

---

## 📝 Standard Replacement Patterns

### Pattern 1: API Endpoints
```javascript
// Before
fetch('http://localhost:8080/api/fish', ...)
axios.get('http://localhost:8080/api/users', ...)

// After
import { API_URL } from '../../config';
fetch(`${API_URL}/fish`, ...)
axios.get(`${API_URL}/users`, ...)
```

### Pattern 2: Image URLs
```javascript
// Before
<img src={`http://localhost:8080${imagePath}`} />
<img src={`http://localhost:8080/uploads/${imagePath}`} />

// After
import { getImageUrl } from '../../config';
<img src={getImageUrl(imagePath)} />
```

### Pattern 3: Base URL + Path
```javascript
// Before
const url = 'http://localhost:8080' + apiPath;

// After
import { API_BASE_URL } from '../../config';
const url = API_BASE_URL + apiPath;
```

---

## 🔍 How to Find and Replace

### Step 1: Search in each file
```bash
# In VS Code, search within file:
http://localhost:8080
```

### Step 2: Add imports at the top
```javascript
import { API_URL, getImageUrl } from '../../config';
// or for nested components:
import { API_URL, getImageUrl } from '../../../config';
```

### Step 3: Replace each occurrence
- API calls: Use `${API_URL}/endpoint`
- Image URLs: Use `getImageUrl(path)`

### Step 4: Test the file
Run the frontend and verify the component works correctly.

---

## ⚠️ Admin Endpoint Path Changes

**IMPORTANT:** Some admin components may need path updates:

### Fish Admin Endpoints
```javascript
// OLD - These will cause 404 errors
'/api/fish/approve'
'/api/fish/reject'

// NEW - Use admin paths
'/api/admin/fish/approve'
'/api/admin/fish/reject'
```

### Industrial Admin Endpoints
```javascript
// OLD
'/api/industrial/approve'
'/api/industrial/reject'

// NEW
'/api/admin/industrial/approve'
'/api/admin/industrial/reject'
```

**Check these files specifically:**
- `Frontend/src/components/admin/ProductManagement.jsx`
- `Frontend/src/components/admin/StuffManagement.jsx`
- `Frontend/src/components/admin/ProductApprove.jsx`

---

## 🧪 Testing After Updates

1. **Start Backend:**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test Each Updated Component:**
   - Login/Registration
   - View fish products
   - View industrial products
   - Admin approval flows
   - Image loading
   - User profile

4. **Check Browser Console:**
   - No 404 errors
   - No CORS errors
   - API calls going to correct URL

---

## 🚀 Production Deployment

### Before Deploying:
1. ✅ All files updated with environment variables
2. ✅ Create `.env.production` file
3. ✅ Test build: `npm run build`
4. ✅ Update backend CORS with production URL
5. ✅ Set production environment variables

### Production .env:
```env
VITE_API_URL=https://your-backend.com/api
NODE_ENV=production
```

---

## 📊 Progress Tracker

- [x] config.js (1/1)
- [x] api.js (1/1)
- [x] Login.jsx (1/1)
- [x] RegistrationForm.jsx (4/4)
- [x] UserProfile.jsx (1/1)
- [ ] Admin components (8 files)
- [ ] Home components (11 files)
- [ ] Shop owner components (1 file)
- [ ] Farm owner components (2 files)
- [ ] Industrial seller components (1 file)
- [ ] Service provider components (1 file)

**Total:** 6/53 fixed (11% complete)
**Remaining:** 47 URLs in 25 files

---

## 🎓 Best Practices Applied

✅ **Centralized Configuration** - Single source of truth  
✅ **Environment Variables** - Easy deployment across environments  
✅ **Helper Functions** - Consistent URL construction  
✅ **Type Safety** - Clear import paths  
✅ **Maintainability** - Change once, update everywhere  

---

## Next Steps

1. **Option A: Manual Update** - Go through each file in the checklist
2. **Option B: Automated Script** - Create a find-replace script
3. **Option C: Gradual Migration** - Update files as you work on features

**Recommendation:** Update critical paths first (auth, admin) then gradually update other components.
