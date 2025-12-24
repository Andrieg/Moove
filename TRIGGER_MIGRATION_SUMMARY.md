# Database Trigger Migration - Summary

**Date:** December 24, 2024
**Status:** Ready to Apply (Manual Step Required)

## What Was Created

### 1. SQL Migration File ✅
**File:** `apply-auth-trigger.sql`

This is the complete SQL migration that creates:
- `handle_new_user()` function - Automatically creates profiles based on user metadata
- `on_auth_user_created` trigger - Fires when new users are created in auth.users
- Verification query - Confirms the trigger was installed correctly

### 2. Test Script ✅
**File:** `test-auth-trigger.mjs`

Automated test that:
- Creates a test coach user with metadata
- Verifies the coach profile was automatically created
- Creates a test member user with metadata
- Verifies the member profile was automatically created
- Reports success/failure with detailed output

### 3. Instructions ✅
**File:** `APPLY_TRIGGER_INSTRUCTIONS.md`

Step-by-step guide for:
- Applying the migration via Supabase Dashboard
- Running the verification test
- Troubleshooting common issues
- Understanding how the trigger works

## Why This Migration is Needed

### Current State (Without Trigger)
When users sign up:
1. ✅ User created in `auth.users` by Supabase Auth
2. ❌ **Manual step required** - Application must insert into `coaches` or `members` table
3. ❌ **Error-prone** - If manual step fails, user has no profile
4. ❌ **Extra code** - Frontend must handle profile creation logic

### Future State (With Trigger)
When users sign up:
1. ✅ User created in `auth.users` by Supabase Auth
2. ✅ **Automatic** - Trigger creates profile in appropriate table
3. ✅ **Reliable** - Profile always created atomically with user
4. ✅ **Simple** - Frontend just passes metadata in signup call

## How to Apply

### Quick Start (3 Steps)

1. **Open Supabase Dashboard SQL Editor**
   - Navigate to https://supabase.com/dashboard
   - Select your project
   - Go to SQL Editor

2. **Run the Migration**
   - Copy contents of `apply-auth-trigger.sql`
   - Paste into SQL Editor
   - Click Run

3. **Verify It Works**
   ```bash
   node test-auth-trigger.mjs
   ```

See `APPLY_TRIGGER_INSTRUCTIONS.md` for detailed instructions.

## How the Trigger Works

### Coach Signup Example

```typescript
// Frontend signup call
await supabase.auth.signUp({
  email: 'john@example.com',
  password: 'password123',
  options: {
    data: {
      role: 'coach',              // ← Trigger reads this
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe Fitness',
      brandSlug: 'john-doe-fitness'
    }
  }
});
```

**What happens:**
1. Supabase Auth creates user in `auth.users`
2. Trigger sees `role === 'coach'`
3. Trigger inserts into `coaches` table:
   ```sql
   INSERT INTO coaches (
     id, email, first_name, last_name,
     display_name, brand_slug
   ) VALUES (
     [user.id], 'john@example.com', 'John', 'Doe',
     'John Doe Fitness', 'john-doe-fitness'
   );
   ```
4. Coach profile exists immediately after signup

### Member Signup Example

```typescript
// Frontend signup call
await supabase.auth.signUp({
  email: 'jane@example.com',
  password: 'password123',
  options: {
    data: {
      role: 'member',             // ← Trigger reads this
      coach_id: '[uuid-of-coach]', // ← Required!
      firstName: 'Jane',
      lastName: 'Smith'
    }
  }
});
```

**What happens:**
1. Supabase Auth creates user in `auth.users`
2. Trigger sees `role === 'member'`
3. Trigger inserts into `members` table:
   ```sql
   INSERT INTO members (
     id, email, coach_id, first_name,
     last_name, status
   ) VALUES (
     [user.id], 'jane@example.com', [coach_id],
     'Jane', 'Smith', 'active'
   );
   ```
4. Member profile exists immediately after signup

## Security Features

### SECURITY DEFINER
The function runs with elevated privileges to bypass Row-Level Security when creating profiles. This is necessary because:
- At trigger time, there's no active user session
- RLS policies would prevent the insert
- The trigger needs to create profiles atomically

### Input Validation
- Only creates profiles if `role` is 'coach' or 'member'
- Members require `coach_id` (won't create without it)
- Uses `ON CONFLICT DO NOTHING` to prevent duplicate entries
- Validates all inputs before insertion

### Data Safety
- All operations are atomic (part of the user creation transaction)
- If trigger fails, user creation rolls back
- No partial states possible

## Frontend Integration

### Before Trigger (Current Code)

```typescript
// In AuthContext.tsx or registration component
const { data: signupData, error } = await supabase.auth.signUp({
  email, password,
  options: { data: { role: 'coach' } }
});

if (!error) {
  // Manual profile creation
  await supabase.from('coaches').insert({
    id: signupData.user.id,
    email: signupData.user.email,
    first_name: firstName,
    last_name: lastName,
    display_name: displayName,
    brand_slug: brandSlug
  });
}
```

### After Trigger (Simplified Code)

```typescript
// In AuthContext.tsx or registration component
const { data: signupData, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: 'coach',
      firstName,
      lastName,
      displayName,
      brandSlug
    }
  }
});
// Profile created automatically! No manual step needed.
```

## Testing Strategy

### Automated Tests
The `test-auth-trigger.mjs` script provides automated verification:
- Creates real test users
- Checks database for profiles
- Cleans up test data
- Reports pass/fail

### Manual Testing
After applying, manually test through your UI:
1. Register a new coach through coach signup form
2. Check Supabase dashboard to verify profile exists
3. Register a new member through member signup form
4. Check Supabase dashboard to verify profile exists

### Integration Test Update
The existing `integration-test.mjs` can be updated to remove manual profile creation once trigger is verified working.

## Rollback Plan

If you need to remove the trigger:

```sql
-- Remove the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove the function
DROP FUNCTION IF EXISTS public.handle_new_user();
```

This returns the system to manual profile creation mode.

## Impact Analysis

### Database
- ✅ No schema changes (only adds function + trigger)
- ✅ No data migration needed
- ✅ Existing profiles unaffected
- ✅ Can be applied/removed safely

### Backend
- ✅ No backend code changes required
- ✅ Existing API endpoints work as before
- ✅ RLS policies unchanged

### Frontend
- ⚠️ Can remove manual profile creation code (optional)
- ⚠️ Should pass metadata during signup (required)
- ✅ Existing users unaffected

### Performance
- ✅ Minimal impact (trigger runs once per user)
- ✅ Atomic operation (no extra round trips)
- ✅ No performance degradation

## Next Steps

1. **Apply the migration** via Supabase Dashboard
2. **Run the test** to verify it works
3. **Update registration forms** to pass required metadata
4. **Test through UI** with real signup flows
5. **Monitor** for any issues in production

## Support Files

All necessary files are in the project root:

- `apply-auth-trigger.sql` - SQL migration
- `test-auth-trigger.mjs` - Automated test
- `APPLY_TRIGGER_INSTRUCTIONS.md` - Detailed instructions
- `MIGRATION_INSTRUCTIONS.md` - Technical documentation
- `PHASE3_TEST_RESULTS.md` - Integration test results
- `PHASE3_SUMMARY.md` - Phase 3 completion summary

## Questions?

Common questions answered in `APPLY_TRIGGER_INSTRUCTIONS.md`:
- How do I verify the trigger is installed?
- What if the test fails?
- Can I run the migration multiple times?
- What metadata is required?
- How do I troubleshoot issues?

---

**Status:** Ready to apply - follow `APPLY_TRIGGER_INSTRUCTIONS.md`
