/**
 * 403 Error Diagnostic Tool
 * 
 * Copy and paste this entire script into your browser console
 * while on the QuoteAcceptance page to diagnose authentication issues
 */

(function() {
  console.log('='.repeat(60));
  console.log('🔍 AQUALINK 403 ERROR DIAGNOSTIC TOOL');
  console.log('='.repeat(60));
  console.log('');

  // Step 1: Check Token
  console.log('📋 STEP 1: Checking Authentication Token');
  console.log('-'.repeat(60));
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ NO TOKEN FOUND in localStorage');
    console.log('   → User needs to log in');
    console.log('   → Redirect to /login');
    console.log('');
    return;
  }
  
  console.log('✅ Token exists');
  console.log('   Token preview:', token.substring(0, 30) + '...');
  console.log('');

  // Step 2: Decode Token
  console.log('📋 STEP 2: Decoding JWT Token');
  console.log('-'.repeat(60));
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ INVALID TOKEN FORMAT');
      console.log('   → Token should have 3 parts separated by dots');
      console.log('   → User needs to log in again');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('✅ Token decoded successfully');
    console.log('');
    console.log('Token Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');

    // Step 3: Check Expiration
    console.log('📋 STEP 3: Checking Token Expiration');
    console.log('-'.repeat(60));
    
    if (payload.exp) {
      const expiryDate = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now >= expiryDate;
      
      console.log('   Issued at:', new Date(payload.iat * 1000).toLocaleString());
      console.log('   Expires at:', expiryDate.toLocaleString());
      console.log('   Current time:', now.toLocaleString());
      console.log('   Time until expiry:', Math.floor((expiryDate - now) / 1000 / 60), 'minutes');
      
      if (isExpired) {
        console.error('❌ TOKEN EXPIRED');
        console.log('   → User needs to log in again');
      } else {
        console.log('✅ Token is still valid');
      }
      console.log('');
    }

    // Step 4: Check Roles
    console.log('📋 STEP 4: Checking User Roles');
    console.log('-'.repeat(60));
    
    const requiredRoles = ['SHOP_OWNER', 'FARM_OWNER', 'INDUSTRIAL_STUFF_SELLER'];
    const userRoles = payload.roles || [];
    
    console.log('   Required roles (any one of):');
    requiredRoles.forEach(role => console.log('      - ' + role));
    console.log('');
    console.log('   User roles in token:');
    if (userRoles.length === 0) {
      console.error('   ❌ NO ROLES FOUND IN TOKEN');
    } else {
      userRoles.forEach(role => console.log('      - ' + role));
    }
    console.log('');
    
    const hasRequiredRole = userRoles.some(role => 
      requiredRoles.includes(role) || requiredRoles.includes(role.replace('ROLE_', ''))
    );
    
    if (hasRequiredRole) {
      console.log('✅ User has required role');
    } else {
      console.error('❌ USER DOES NOT HAVE REQUIRED ROLE');
      console.log('   → This is likely the cause of the 403 error');
      console.log('   → User needs to be assigned a proper role');
      console.log('   → Contact administrator to update user role in database');
    }
    console.log('');

    // Step 5: Check User Info
    console.log('📋 STEP 5: Checking User Information');
    console.log('-'.repeat(60));
    
    console.log('   Email:', payload.sub || payload.email || 'Not found');
    console.log('   User ID:', payload.userId || 'Not found');
    console.log('');

    // Step 6: Test Authorization Header
    console.log('📋 STEP 6: Testing Authorization Header');
    console.log('-'.repeat(60));
    
    const authHeader = `Bearer ${token}`;
    console.log('   Header will be sent as:');
    console.log('   Authorization:', authHeader.substring(0, 40) + '...');
    console.log('');

    // Step 7: Summary
    console.log('='.repeat(60));
    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(60));
    
    const issues = [];
    
    if (!token) issues.push('No token found');
    if (payload.exp && new Date() >= new Date(payload.exp * 1000)) issues.push('Token expired');
    if (!hasRequiredRole) issues.push('Missing required role');
    if (userRoles.length === 0) issues.push('No roles in token');
    
    if (issues.length === 0) {
      console.log('✅ All checks passed!');
      console.log('');
      console.log('If you still see 403 error:');
      console.log('1. Check backend is running on port 8080');
      console.log('2. Check backend logs for JWT filter messages');
      console.log('3. Verify CORS is configured correctly');
      console.log('4. Check database user_roles table');
    } else {
      console.error('❌ Issues found:');
      issues.forEach((issue, i) => console.error(`   ${i + 1}. ${issue}`));
      console.log('');
      console.log('🔧 RECOMMENDED ACTIONS:');
      
      if (issues.includes('No token found') || issues.includes('Token expired')) {
        console.log('   → Log out and log in again');
        console.log('   → localStorage.clear(); window.location.href="/login";');
      }
      
      if (issues.includes('Missing required role') || issues.includes('No roles in token')) {
        console.log('   → Contact administrator to assign proper role');
        console.log('   → Required role: SHOP_OWNER, FARM_OWNER, or INDUSTRIAL_STUFF_SELLER');
        console.log('   → Check database query:');
        console.log('      SELECT u.email, r.name FROM user u');
        console.log('      JOIN user_roles ur ON u.id = ur.user_id');
        console.log('      JOIN role r ON ur.role_id = r.id');
        console.log('      WHERE u.email = \'' + (payload.sub || payload.email) + '\';');
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR DECODING TOKEN:', error.message);
    console.log('   → Token might be corrupted');
    console.log('   → User needs to log in again');
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('📝 For more help, see: TROUBLESHOOTING_403_ERROR.md');
  console.log('='.repeat(60));
})();
