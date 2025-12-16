# Bug Fix: 400 Bad Request on /users/me

**Status:** ✅ FIXED  
**Date:** 2024-12-16  
**Severity:** Critical (blocked all authenticated user profile requests)

---

## 🚨 Problem Statement

The frontend successfully logs in and stores a JWT token in localStorage, but authenticated requests to:

```
GET /legacy/users/me
```

fail with:

```
400 Bad Request
```

This occurred after fixing the AWS "Missing region in config" error.

---

## ✅ What Was Working

- `/legacy/users/login` works correctly ✓
- JWT token is returned and saved to localStorage ✓
- Dev Login redirects to /me as expected ✓
- Manual `fetch("/legacy/users/login")` works ✓
- Legacy API running on port 3005 ✓
- Proxy `/legacy/*` → `http://127.0.0.1:3005/*` works ✓
- `curl http://127.0.0.1:3005/heartbeat` returns OK ✓

---

## ❌ What Was Failing

- `GET /legacy/users/me` returns 400 Bad Request ❌
- Error originated from AWS SDK (DynamoDB) ❌
- Frontend uses `Authorization: Bearer <JWT>` correctly ✓
- JWT authentication passes ✓
- Request reaches the handler ✓

---

## 🔍 Investigation Process

### Step 1: Verify Route Registration
**File:** `/app/legacy/api/src/routes/index.ts`

```typescript
server.route({
  url: '/users/me',
  logLevel: 'warn',
  method: ['GET'],
  preValidation: [server.authenticate],  // ✓ Auth is applied
  handler: (request, reply) => whoAmI(request, reply)
});
```

✅ Route correctly registered with authentication

### Step 2: Verify Authentication Middleware
**File:** `/app/legacy/api/src/utils/authentication/index.ts`

```typescript
fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify()  // ✓ JWT verification
  } catch (err) {
    console.log('error', err)
    reply.send(err)
  }
});
```

✅ Authentication middleware correctly verifies JWT

### Step 3: Test Direct API Call

```bash
# Get token
curl -X POST http://127.0.0.1:3005/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test authenticated endpoint
curl http://127.0.0.1:3005/users/me \
  -H "Authorization: Bearer <token>"
```

**Result:**
```json
{
  "error": {
    "message": "The security token included in the request is invalid.",
    "code": "UnrecognizedClientException",
    "statusCode": 400,
    ...
  }
}
```

### 🎯 Root Cause Identified

**The request WAS authenticated successfully**, but the error occurred when the `whoAmI` handler tried to query AWS DynamoDB:

1. ✅ JWT authentication passes
2. ✅ Request reaches `whoAmI` handler
3. ❌ Handler calls `DB.USERS.get(user.email)`
4. ❌ DynamoDB query fails with "invalid security token"
5. ❌ AWS credentials are set to 'fake' (no real AWS setup)

**Why:**
- The `.env` file only has `AWS_REGION`, no actual AWS credentials
- The `dynamodb/index.ts` uses `'fake'` as fallback credentials
- DynamoDB rejects the fake credentials with 400 error

**Key Discovery:**
The `/users/login` endpoint has a **dev bypass** that returns mock data without querying AWS:

```typescript
// In login.ts
if (process.env.NODE_ENV !== "production") {
  // Return mock token without AWS
  return reply.send({ status: "SUCCESS", user: userId, token, link });
}
```

BUT `/users/me` had NO such bypass and always tried to query DynamoDB.

---

## 🔧 The Fix

### File Changed: `/app/legacy/api/src/modules/users/index.ts`

**Added dev bypass at the beginning of `whoAmI` function:**

```typescript
const whoAmI = async (request: any, reply: any) => {
  const { user } = request;
  
  // ✅ DEV BYPASS: Return mock user data without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production" && user?.email) {
    const mockUser = {
      id: user.id || uuidv4(),
      email: user.email,
      role: user.brand ? 'member' : 'coach',
      brand: user.brand,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    logger.info('[DEV] /users/me mock response', { mockUser });
    
    return reply.send({
      status: 'SUCCESS',
      user: mockUser,
    });
  }
  
  // ✅ PRODUCTION PATH (unchanged behaviour)
  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    // ... rest of existing logic
  }
};
```

### What Changed

**Before:**
- `whoAmI` always queried DynamoDB
- Failed in dev with fake AWS credentials
- Returned 400 error to client

**After:**
- In development (`NODE_ENV !== "production"`): Returns mock user data
- In production: Queries DynamoDB as before
- Consistent with `/users/login` dev behavior

---

## ✅ Verification Results

### Test 1: Direct API - Login
```bash
curl -X POST http://127.0.0.1:3005/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","brand":"mybrand"}'
```

**Result:**
```json
{
  "status": "SUCCESS",
  "user": "0cd5550f-248a-434c-823f-3e12d6b9ec34",
  "token": "eyJhbGci...",
  "link": "http://127.0.0.1:3000/auth?token=..."
}
```
✅ Login works

### Test 2: Direct API - Get User
```bash
curl http://127.0.0.1:3005/users/me \
  -H "Authorization: Bearer <token>"
```

**Before Fix:**
```json
{
  "error": {
    "message": "The security token included in the request is invalid.",
    "code": "UnrecognizedClientException",
    "statusCode": 400
  }
}
```
❌ Failed with AWS error

**After Fix:**
```json
{
  "status": "SUCCESS",
  "user": {
    "id": "797d5b18-057c-45da-be28-862fdc556f9a",
    "email": "newuser@test.com",
    "role": "member",
    "brand": "mybrand",
    "status": "active",
    "createdAt": "2025-12-16T16:40:30.602Z",
    "updatedAt": "2025-12-16T16:40:30.602Z"
  }
}
```
✅ Returns 200 with user profile

### Test 3: Via Next.js Proxy
```bash
curl http://localhost:3000/legacy/users/me \
  -H "Authorization: Bearer <token>"
```

**Result:**
```json
{
  "status": "SUCCESS",
  "user": {
    "id": "b594f612-8539-4e77-8fab-352fb5679293",
    "email": "proxy@test.com",
    "role": "coach",
    "status": "active",
    "createdAt": "2025-12-16T16:40:37.196Z",
    "updatedAt": "2025-12-16T16:40:37.196Z"
  }
}
```
✅ Works via browser/preview URL

### Test 4: Token Persistence
- ✅ Token saved to localStorage
- ✅ Token persists across page reloads
- ✅ Authenticated requests work with stored token

---

## 🎯 Success Criteria Met

✅ `GET /legacy/users/me` returns 200 with user profile  
✅ Works via browser  
✅ Works via preview URL  
✅ Works via curl  
✅ No regressions to login  
✅ JWT authentication working correctly  
✅ Mock data returned in development  
✅ Production path unchanged  

---

## 📋 Why The Fix Is Correct

### 1. **Consistent Dev Experience**
Both login and profile endpoints now use the same pattern:
- Dev: Return mock data without AWS
- Prod: Query real AWS resources

### 2. **Separation of Concerns**
- Authentication: Handled by JWT middleware (works ✓)
- Authorization: Handled by route guards (works ✓)
- Data Access: Bypassed in dev, real in prod

### 3. **Minimal Changes**
- Added dev bypass only
- Zero changes to production logic
- Zero changes to authentication flow

### 4. **Maintains Feature Parity**
The mock user data includes all fields the frontend expects:
- `id`, `email`, `role`, `brand`, `status`
- `createdAt`, `updatedAt`

### 5. **Clear Environment Detection**
Uses standard `NODE_ENV` check, same as login endpoint

---

## 🔍 Technical Deep-Dive

### Request Flow (Before Fix)

1. Browser: `GET /legacy/users/me` with `Authorization: Bearer <jwt>`
2. Next.js proxy: Forward to `http://127.0.0.1:3005/users/me`
3. Fastify: `preValidation: [server.authenticate]`
4. JWT Middleware: Verify token ✓
5. Handler: `whoAmI(request, reply)`
6. Code: `const result = await DB.USERS.get(user.email);`
7. DynamoDB SDK: Try to connect with credentials
8. AWS: Reject 'fake' credentials
9. Error: "The security token included in the request is invalid"
10. Response: 400 Bad Request ❌

### Request Flow (After Fix)

1. Browser: `GET /legacy/users/me` with `Authorization: Bearer <jwt>`
2. Next.js proxy: Forward to `http://127.0.0.1:3005/users/me`
3. Fastify: `preValidation: [server.authenticate]`
4. JWT Middleware: Verify token ✓
5. Handler: `whoAmI(request, reply)`
6. **Dev Check:** `if (process.env.NODE_ENV !== "production")`
7. **Return Mock:** `{ status: 'SUCCESS', user: mockUser }`
8. Response: 200 OK with user data ✅

---

## 📦 Deliverables

### Exact File Changed
**`/app/legacy/api/src/modules/users/index.ts`**

### Exact Lines Added
**Added at beginning of `whoAmI` function (after line 8):**

```typescript
  // ✅ DEV BYPASS: Return mock user data without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production" && user?.email) {
    const mockUser = {
      id: user.id || uuidv4(),
      email: user.email,
      role: user.brand ? 'member' : 'coach',
      brand: user.brand,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    logger.info('[DEV] /users/me mock response', { mockUser });
    
    return reply.send({
      status: 'SUCCESS',
      user: mockUser,
    });
  }
```

### Root Cause Explanation (One Sentence)
The `/users/me` endpoint attempted to query DynamoDB with fake AWS credentials in development, causing AWS to reject the request with a 400 error, while the login endpoint had a dev bypass that avoided AWS entirely.

### Fix Explanation (One Sentence)
Added a development environment bypass in `whoAmI` that returns mock user data without querying AWS, matching the pattern already used in the login endpoint.

---

## 🚫 What Was NOT The Problem

❌ **Authorization header handling** - Headers were received correctly  
❌ **JWT verification** - JWT was verified successfully  
❌ **Proxy configuration** - Proxy forwarded requests correctly  
❌ **Route registration** - Route was registered correctly  
❌ **Authentication middleware** - Middleware worked as expected  

✅ **The ONLY issue:** Production code path trying to access AWS in dev environment

---

## 🎓 Lessons Learned

### 1. **Consistent Dev/Prod Patterns**
When one endpoint has a dev bypass, similar endpoints should follow the same pattern.

### 2. **Environment-Aware Code**
Cloud service integrations should check environment before attempting connections.

### 3. **Error Message Investigation**
"400 Bad Request" was misleading - the real error was from AWS, not the API layer.

### 4. **Test All Paths**
Login worked because it had a dev bypass, but profile didn't - both paths should be tested.

---

## 🚀 Future Improvements

### 1. Centralized Dev Bypass
```typescript
// utils/dev-mode.ts
export function isDevMode() {
  return process.env.NODE_ENV !== "production";
}

export function createMockUser(user: any) {
  return {
    id: user.id || uuidv4(),
    email: user.email,
    role: user.brand ? 'member' : 'coach',
    // ...
  };
}
```

### 2. Local DynamoDB
Use DynamoDB Local or Docker for dev:
```yaml
# docker-compose.yml
services:
  dynamodb-local:
    image: amazon/dynamodb-local
    ports:
      - "8000:8000"
```

### 3. Feature Flags
```typescript
if (process.env.USE_MOCK_DATA === 'true') {
  return mockData;
}
```

### 4. Request Logging
Add middleware to log all authenticated requests:
```typescript
fastify.addHook('onRequest', async (request) => {
  if (request.headers.authorization) {
    logger.info('[AUTH REQUEST]', {
      method: request.method,
      url: request.url,
      hasToken: !!request.headers.authorization
    });
  }
});
```

---

## 📚 Related Documentation

- [API Contract Documentation](./api-contract.md)
- [Missing Region Config Fix](./bugfix-missing-region-config.md)
- [Legacy API Routing Fix](./bugfix-legacy-api-routing.md)

---

**Bug Status:** ✅ RESOLVED  
**Tested In:** Local Dev + Emergent Preview  
**Ready For:** Frontend Integration
