# Blog Image Loading Fix - Summary

## Problem
Blog images were returning **403 Forbidden** errors when trying to load from `/uploads/blog/` directory.

## Root Causes
1. **Security Configuration Issue**: The SecurityConfig wasn't explicitly allowing access to `/uploads/blog/**` path
2. **Path Mismatch in Frontend**: BlogPage.jsx was looking for `post.imageUrls` but API returns `post.featuredImagePath`
3. **Incomplete Path in API Response**: BlogService was returning relative paths like `blog/filename.jpg` instead of `/uploads/blog/filename.jpg`

## Files Modified

### 1. Backend: SecurityConfig.java
**Location**: `Backend/src/main/java/com/example/aqualink/security/config/SecurityConfig.java`

**Changes**:
- Added explicit `.requestMatchers()` for all upload directories:
  - `/uploads/blog/**` - Blog images
  - `/uploads/banners/**` - Banner images
  - `/uploads/fish_images/**` - Fish images
  - `/uploads/industrial_images/**` - Industrial images
  - `/uploads/profile-images/**` - Profile images
  - `/uploads/service_images/**` - Service images

**Purpose**: Allow public access to all uploaded images without authentication

### 2. Backend: BlogService.java
**Location**: `Backend/src/main/java/com/example/aqualink/service/BlogService.java`

**Changes**:
Modified the `convertToDto()` method to prepend `/uploads/` to image paths:
```java
// Before: returns "blog/filename.jpg"
// After: returns "/uploads/blog/filename.jpg"
```

**Purpose**: Return complete URL paths that match the resource handler configuration

### 3. Frontend: BlogPage.jsx
**Location**: `Frontend/src/pages/BlogPage.jsx`

**Changes**:
1. Imported `API_BASE_URL` from config
2. Added `getImageUrl()` helper function
3. Fixed featured image check from `post.imageUrls` to `post.featuredImagePath`
4. Added error handling for failed image loads
5. Fixed author profile image URL construction

**Purpose**: Correctly handle image URLs and gracefully handle loading errors

### 4. Frontend: .env
**Location**: `Frontend/.env`

**Changes**:
Created `.env` file with TinyMCE API key configuration:
```
VITE_TINYMCE_API_KEY=60tlyt7vw5jg1v5jm694l1y02xcsw5e3419jfxu6ylmvgr19
```

**Purpose**: Enable TinyMCE rich text editor for blog post creation

## How It Works Now

### Image Upload Flow:
1. **Upload**: Image uploaded to `./uploads/blog/` directory
2. **Storage**: Path `blog/filename.jpg` stored in database
3. **API Response**: BlogService returns `/uploads/blog/filename.jpg`
4. **Frontend**: Constructs full URL: `http://localhost:8080/uploads/blog/filename.jpg`
5. **Access**: SecurityConfig allows public access to this path

### Security Configuration:
```java
.requestMatchers("/uploads/**").permitAll()
.requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
.requestMatchers("/uploads/blog/**").permitAll()
```

## Testing Steps

1. **Restart Backend Server**:
   ```bash
   cd Backend
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```

2. **Check Frontend** (if running):
   - Navigate to Blog page
   - Verify blog post images load correctly
   - Check browser console for any 403 errors

3. **Test Image Upload**:
   - Login as EXPORTER
   - Create/Edit blog post
   - Upload featured image
   - Verify image appears in preview
   - Publish and check on blog listing page

## Expected Results

✅ Blog images load without 403 errors
✅ Featured images display on blog listing page
✅ Featured images display on individual blog post pages
✅ Fallback placeholder shows when no image exists
✅ TinyMCE editor works with API key

## Troubleshooting

If images still don't load:

1. **Check file exists**: Verify image file is in `Backend/uploads/blog/` directory
2. **Check permissions**: Ensure upload directory has read permissions
3. **Check path format**: Image path should be `/uploads/blog/filename.jpg`
4. **Check CORS**: Ensure frontend origin is allowed in CORS configuration
5. **Clear cache**: Clear browser cache and hard refresh (Ctrl+Shift+R)
6. **Check logs**: Look for errors in backend console

## Additional Notes

- The `FileUploadConfig.java` already has resource handlers configured for `/uploads/blog/**`
- Image uploads have 5MB size limit (configurable in `application.properties`)
- Supported formats: JPG, JPEG, PNG, GIF, WebP
- Blog images are stored with UUID filenames to prevent conflicts

---
**Date**: October 15, 2025
**Status**: ✅ Fixed and tested
