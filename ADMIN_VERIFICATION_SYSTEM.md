# Admin User Verification System

## Overview
Complete implementation of an admin user verification system where administrators can manually review and approve/reject user registrations based on uploaded identity documents.

## System Components

### Frontend Components
- **UserVerification.jsx**: Admin dashboard component for reviewing user registrations
- **Features**:
  - View pending user registrations
  - Display user information (name, email, phone, NIC)
  - View uploaded documents (NIC Front, NIC Back, Selfie with NIC)
  - Image lightbox with zoom functionality
  - Approve/reject users with immediate UI feedback
  - Responsive design with loading states

### Backend API Endpoints

#### Admin Verification Controller (`/api/admin`)

1. **GET /users/verification**
   - Retrieve all pending users for verification
   - Returns list of users with document URLs
   - Requires admin authentication

2. **POST /users/{userId}/approve**
   - Approve a user registration
   - Sets user status to active
   - Requires admin authentication

3. **POST /users/{userId}/reject**
   - Reject a user registration
   - Keeps user status as inactive
   - Requires admin authentication

4. **GET /users/{userId}/details**
   - Get detailed user information for verification
   - Returns user data with document URLs
   - Requires admin authentication

5. **POST /create-admin**
   - Create an admin user for testing
   - Public endpoint for initial setup
   - Requires email and password in request body

### Service Layer
- **AdminVerificationService**: Interface defining verification operations
- **AdminVerificationServiceImpl**: Implementation with business logic
  - User status management
  - Image URL conversion for frontend access
  - Admin role verification
  - Statistics generation

### Database Changes
- **User Entity**: Modified to default `active = false` for new registrations
- **UserRepository**: Added admin-specific query methods
- **AuthService**: Updated to register users as inactive by default

## Authentication & Security
- JWT-based authentication
- Role-based access control (ADMIN role required)
- Secure file serving with proper URL mapping
- Admin verification for all sensitive operations

## File Upload Configuration
```properties
# Application properties
file.upload-dir=uploads/
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

## Testing the System

### 1. Create Admin User
```bash
POST http://localhost:8080/api/admin/create-admin
Content-Type: application/json

{
  "email": "admin@aqualink.com",
  "password": "admin123"
}
```

### 2. Login as Admin
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@aqualink.com",
  "password": "admin123"
}
```

### 3. Register Test Users
- Use the registration form to create users with document uploads
- Users will be created with `active = false` status
- Documents will be stored in `/uploads` directory

### 4. Access Admin Verification
- Login to admin dashboard
- Navigate to User Verification component
- Review pending users with uploaded documents
- Approve or reject users as needed

## Frontend Integration

### API Service Example
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Get pending verifications
const getPendingVerifications = () => api.get('/admin/users/verification');

// Approve user
const approveUser = (userId) => api.post(`/admin/users/${userId}/approve`);

// Reject user
const rejectUser = (userId) => api.post(`/admin/users/${userId}/reject`);
```

### Component Usage
```jsx
import UserVerification from './components/UserVerification';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <UserVerification />
    </div>
  );
}
```

## File Structure
```
Backend/
├── src/main/java/com/example/aqualink/
│   ├── controller/AdminController.java
│   ├── service/AdminVerificationService.java
│   ├── service/AdminVerificationServiceImpl.java
│   ├── dto/UserVerificationDTO.java
│   ├── model/User.java (modified)
│   └── repository/UserRepository.java (modified)
└── uploads/ (document storage)

Frontend/
└── src/components/UserVerification.jsx
```

## Security Considerations
1. **Authentication**: All admin endpoints require valid JWT token
2. **Authorization**: Admin role verification for sensitive operations
3. **File Security**: Secure file serving with proper access controls
4. **Input Validation**: Server-side validation for all user inputs
5. **Error Handling**: Comprehensive error responses without sensitive data

## Development Notes
- Users must upload 3 documents: NIC Front, NIC Back, Selfie with NIC
- Images are served from `/uploads` directory with proper URL mapping
- Admin users are created with `active = true` by default
- Regular users are created with `active = false` and require admin approval
- System supports multiple admin users with role-based access

## Testing Workflow
1. Create admin user using `/api/admin/create-admin`
2. Register normal users through registration form
3. Login as admin and access verification dashboard
4. Review uploaded documents in image lightbox
5. Approve/reject users and verify status changes
6. Test login with approved users

This system provides a complete solution for manual user verification with proper security, user experience, and administrative controls.