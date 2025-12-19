# 401 Authentication Redirect Setup

## Overview
The application now has centralized 401 authentication handling. When the backend returns a 401 Unauthorized status, the app automatically:
1. Clears all stored authentication tokens
2. Redirects the user to the login page

## Implementation Details

### Centralized API Client
A new API client with interceptors has been created at `src/app/utils/apiClient.ts`. This client:

- **Automatically adds JWT tokens** to all API requests (request interceptor)
- **Handles 401 responses** by clearing auth data and redirecting to login (response interceptor)
- **Uses environment variable** for API base URL: `NEXT_PUBLIC_API_URL`

### How It Works

```typescript
// Request Interceptor - Adds token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// Response Interceptor - Handles 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      
      // Redirect to login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
```

### Components Updated

All components that make API calls have been updated to use the centralized `apiClient`:

**User-facing components:**
- `src/app/components/LoginForm.tsx`
- `src/app/components/DeviceList.tsx`
- `src/app/components/NewDeviceForm.tsx`
- `src/app/components/fetchDevice.ts`
- `src/app/devices/[deviceId]/create-pass/page.tsx`
- `src/app/devices/[deviceId]/create-pass/PassList.tsx`

**Admin components:**
- `src/app/admin/page.tsx`
- `src/app/admin/users.tsx`
- `src/app/admin/AdminNewDeviceForm.tsx`

**Removed legacy interceptor:**
- Removed the inline axios interceptor from `src/app/components/Header.tsx` (now using centralized apiClient)

### Usage Example

Before (direct axios):
```typescript
const token = localStorage.getItem("token");
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const res = await axios.get(`${apiUrl}/api/devices`, {
  headers: { Authorization: `JWT ${token}` }
});
```

After (using apiClient):
```typescript
import apiClient from "../utils/apiClient";
const res = await apiClient.get(`/api/devices`);
```

### Benefits

1. **Single point of control** - All API requests go through one configured client
2. **Automatic authentication** - No need to manually add tokens to each request
3. **Consistent 401 handling** - All 401 responses trigger logout and redirect
4. **Cleaner code** - No need to manage tokens or API URLs in every component
5. **No SSR issues** - Window location redirect happens only in browser

## Testing

To test the 401 redirect:

1. Log in to the application
2. Delete the token from localStorage (DevTools → Application → LocalStorage)
3. Make any API request (e.g., navigate to a device page or refresh the device list)
4. You should be automatically redirected to the login page

## Configuration

The API base URL is configured via the environment variable:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This can be set in `.env.local` or `.env` files.
