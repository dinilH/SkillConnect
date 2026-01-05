# Cookie-Based Authentication Migration Guide

## ✅ Completed Backend Changes

1. **Installed cookie-parser** - Now parsing cookies in requests
2. **Updated server.js** - Added cookie-parser middleware
3. **Modified login endpoint** - Now sets httpOnly cookie with 1-day expiration
4. **Added logout endpoint** - POST `/api/logout` to clear auth cookie
5. **Updated authMiddleware** - Now reads token from cookie (with Authorization header fallback)

## ⚠️ Required Frontend Changes

**CRITICAL**: All `fetch()` calls that need authentication MUST include `credentials: 'include'` to send cookies.

### Pattern to Follow:

```javascript
// ❌ OLD (won't send cookies)
fetch('http://localhost:5000/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})

// ✅ NEW (sends cookies)
fetch('http://localhost:5000/api/endpoint', {
  credentials: 'include'  // This sends the httpOnly cookie
})
```

### Files That Need Updates:

Search for all files with `fetch(` and add `credentials: 'include'` to:

1. **All API calls** in:
   - `src/Pages/**/*.jsx`
   - `src/components/**/*.jsx`
   - `src/**/*.js`

2. **Remove these lines** (token no longer in localStorage):
   - `Authorization: \`Bearer ${localStorage.getItem('token')}\``
   - Any code reading `localStorage.getItem('token')`

### Example Updates Needed:

```javascript
// Example 1: Simple GET request
fetch(`${apiBase}/profile/${userId}`, {
  credentials: 'include'
})

// Example 2: POST request
fetch(`${apiBase}/posts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(postData)
})

// Example 3: File upload (FormData)
fetch(`${apiBase}/profile/update`, {
  method: 'PUT',
  credentials: 'include',
  body: formData  // Don't set Content-Type for FormData
})
```

### Files Already Updated:
- ✅ `AuthContext.jsx` - Login/logout updated
- ✅ `AuthModal.jsx` - Login form updated

### Next Steps:

Run this command to find all fetch calls that need updating:

```bash
cd frontend
grep -r "fetch(" src/ --include="*.jsx" --include="*.js"
```

Then update each fetch call to include `credentials: 'include'`.

## Security Benefits

- **httpOnly cookies** - JavaScript can't access the token (XSS protection)
- **sameSite: 'lax'** - CSRF protection
- **secure flag** - HTTPS-only in production
- **1 day expiration** - Automatic logout after 24 hours
