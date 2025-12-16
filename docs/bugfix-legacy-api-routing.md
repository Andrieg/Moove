# Bug Fix: /legacy/api/legacy Routing Issue

**Status:** ✅ FIXED  
**Date:** 2024-12-14  
**Severity:** Critical (404/502 errors on all auth endpoints)

---

## Problem Summary

API calls from the frontend were incorrectly hitting:

```
/legacy/api/legacy/users/login  ❌
```

Instead of the correct path:

```
/legacy/users/login  ✓
```

This caused 404/502 errors even though manual tests of `/legacy/users/login` worked correctly.

---

## Root Cause Analysis

### Architecture Overview

1. **Frontend:** `apps/client` (Next.js 16 App Router)
2. **Legacy API:** `legacy/api` (Fastify, port 3005)
3. **Proxy Route:** `apps/client/app/legacy/[...path]/route.ts`
4. **API Client:** `packages/api-client/src/http.ts`

### The Bug

**Double-prefixing occurred in the request path construction:**

```typescript
// In auth.ts (BEFORE FIX)
apiFetch("/api/legacy/users/login", { ... })
         ^^^^^^^^^^^^^^^^^^^^^ ❌ Included /api/legacy prefix

// In http.ts
const baseUrl = "/legacy";  // Browser default
const url = `${baseUrl}${normalizePath(path)}`;

// Result:
// /legacy + /api/legacy/users/login = /legacy/api/legacy/users/login ❌
```

### Why It Happened

1. The proxy route handler is located at `app/legacy/[...path]/route.ts`
2. This means it handles requests to `/legacy/*`
3. The `getBaseUrl()` correctly returns `/legacy` for browser requests
4. BUT `auth.ts` was calling `apiFetch("/api/legacy/users/login")` 
5. This created a double prefix: `/legacy` + `/api/legacy/...`

### Inconsistency in Codebase

Different API client files were using inconsistent path patterns:

| File | Path Pattern | Status |
|------|-------------|--------|
| `auth.ts` | `/api/legacy/users/login` | ❌ Wrong |
| `users.ts` | `/users/me`, `/users/:id` | ✓ Correct |
| `content.ts` | `/videos`, `/challenges` | ✓ Correct |

---

## The Fix

### 1. Fixed `auth.ts` (Primary Fix)

**Changed:**
```typescript
// BEFORE
export function requestLoginLink(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/api/legacy/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// AFTER
export function requestLoginLink(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
```

**Result:** Path now consistent with other API client methods.

---

### 2. Enhanced `http.ts` (Defense in Depth)

Added normalization guards to prevent future double-prefixing bugs:

```typescript
function normalizePath(path: string) {
  // Ensure leading slash
  let normalized = path.startsWith("/") ? path : `/${path}`;
  
  // GUARD: Prevent double-prefixing bugs
  // Remove any accidental /api/legacy or /legacy prefix from the path
  // since the baseUrl already includes /legacy
  normalized = normalized.replace(/^\/api\/legacy/, "");
  normalized = normalized.replace(/^\/legacy\/legacy/, "/legacy");
  
  return normalized;
}
```

**Why This Guard Helps:**
- Protects against future mistakes
- Strips out accidental `/api/legacy` prefixes
- Prevents `/legacy/legacy` double-prefix
- Defensive programming approach

---

## Request Flow (After Fix)

### Browser Request Flow

1. **Frontend calls:**
   ```typescript
   requestLoginLink({ email: "user@example.com" })
   ```

2. **API client constructs URL:**
   ```typescript
   baseUrl = "/legacy"           // from NEXT_PUBLIC_API_URL
   path = "/users/login"         // from auth.ts (fixed)
   url = "/legacy/users/login"   // ✓ Correct!
   ```

3. **Next.js route handler receives:**
   ```
   Request: /legacy/users/login
   ```

4. **Proxy forwards to legacy API:**
   ```typescript
   const target = "http://127.0.0.1:3005/users/login";
   ```

5. **Legacy API processes and responds** ✓

---

## Verification Steps

### ✅ Manual Testing

```bash
# Test the proxy route directly
curl http://localhost:3000/legacy/heartbeat

# Test login endpoint
curl -X POST http://localhost:3000/legacy/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### ✅ Browser DevTools Checklist

1. Open DevTools → Network tab
2. Trigger login from UI
3. Verify request URL is `/legacy/users/login` (not `/legacy/api/legacy/...`)
4. Verify response status is 200
5. Verify token is saved to localStorage
6. Verify `/legacy/users/me` works after login

### ✅ Expected Behavior

- ✓ `fetch("/legacy/users/login")` works
- ✓ `requestLoginLink()` works from React components
- ✓ No requests hit `/legacy/api/legacy/*`
- ✓ Auth token persists in localStorage
- ✓ `/legacy/users/me` returns user data
- ✓ Works in Emergent preview environment

---

## Why The Fix Is Correct

### 1. **Consistency**
All API client methods now use the same path pattern (no prefix):
- `/users/login` ✓
- `/users/me` ✓
- `/videos` ✓
- `/challenges` ✓

### 2. **Separation of Concerns**
- **API Client Methods:** Define endpoint paths (e.g., `/users/login`)
- **`apiFetch` Function:** Adds the base URL (e.g., `/legacy`)
- **Environment Config:** Defines where the API is (`.env.local`)

### 3. **Single Source of Truth**
The baseUrl is determined once in `getBaseUrl()` and applied consistently.

### 4. **Environment Agnostic**
Works correctly in all environments:
- Local development
- Emergent preview
- Production (when pointing to real API)

### 5. **Defensive Guards**
The `normalizePath()` guards protect against regression:
- Strips accidental double-prefixes
- Future-proof against similar bugs

---

## Files Changed

1. **`/app/packages/api-client/src/auth.ts`**
   - Changed: `"/api/legacy/users/login"` → `"/users/login"`
   - Impact: Primary bug fix

2. **`/app/packages/api-client/src/http.ts`**
   - Enhanced: `normalizePath()` function
   - Added: Double-prefix prevention guards
   - Impact: Defense in depth

---

## Configuration Reference

### `.env.local`
```env
NEXT_PUBLIC_API_URL=/legacy
LEGACY_API_URL=http://127.0.0.1:3005
```

### Proxy Route Location
```
apps/client/app/legacy/[...path]/route.ts
```

This handles all requests matching `/legacy/*` and forwards them to the legacy API.

---

## Lessons Learned

### 1. **Path Conventions Matter**
Establish clear conventions for API path definitions:
- API client methods should use relative paths without base URL
- Base URL should be configurable via environment variables
- Never hardcode base URLs in method calls

### 2. **Consistency Across Codebase**
When one file uses `/users/me` and another uses `/api/legacy/users/login`, it indicates a pattern inconsistency that needs addressing.

### 3. **Defensive Programming**
Adding normalization guards prevents future bugs even if developers make mistakes.

### 4. **Test Different Environments**
Local vs. preview vs. production environments may expose routing issues not visible in one environment.

---

## Related Documentation

- [API Contract Documentation](./api-contract.md)
- [System Overview](../system-overview.md)
- [AI Goals](../ai-goals.md)

---

## Future Improvements

### 1. Add Request Logging
```typescript
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${baseUrl}${normalizePath(path)}`;
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Request]', options.method || 'GET', url);
  }
  
  // ... rest of implementation
}
```

### 2. Add TypeScript Path Constants
```typescript
// api-paths.ts
export const API_PATHS = {
  AUTH: {
    LOGIN: '/users/login',
    ME: '/users/me',
  },
  VIDEOS: {
    LIST: '/videos',
    DETAIL: (id: string) => `/videos/${id}`,
  },
} as const;
```

### 3. Add Integration Tests
Test the complete flow from frontend → proxy → legacy API.

---

**Bug Status:** ✅ RESOLVED  
**Tested In:** Emergent Preview  
**Ready For:** Production Deployment
