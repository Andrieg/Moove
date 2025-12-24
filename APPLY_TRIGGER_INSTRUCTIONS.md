# How to Apply the Auth Profile Trigger

The automatic migration tools are not available in this environment, so you need to apply the trigger manually through the Supabase Dashboard.

## Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: **pghfvrerwycfhmcewiup**
3. Navigate to **SQL Editor** in the left sidebar

## Step 2: Apply the Migration

1. Click **New Query** in the SQL Editor
2. Open the file: **`apply-auth-trigger.sql`**
3. Copy the entire contents of that file
4. Paste it into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

You should see a success message and the verification query will show the trigger was created.

## Step 3: Verify the Trigger

Run the test script to verify the trigger is working:

```bash
node test-auth-trigger.mjs
```

This will:
- Create a test coach user with metadata
- Check if the profile was automatically created
- Create a test member user with metadata
- Check if the profile was automatically created
- Report success or failure

### Expected Output (Success)

```
🧪 Testing Auth Profile Trigger

============================================================

📋 Test 1: Coach Profile Auto-Creation
------------------------------------------------------------
1. Signing up coach with metadata...
✅ User created: [uuid]
2. Checking if profile was auto-created...
✅ Profile automatically created!
   ID: [uuid]
   Email: trigger-test-coach-...@test.com
   Name: Trigger Test
   Display Name: Trigger Test Coach
   Brand Slug: trigger-coach-...

📋 Test 2: Member Profile Auto-Creation
------------------------------------------------------------
1. Finding a coach for member assignment...
   Using coach: [coach name]
2. Signing up member with metadata...
✅ User created: [uuid]
3. Checking if profile was auto-created...
✅ Profile automatically created!
   ID: [uuid]
   Email: trigger-test-member-...@test.com
   Name: Trigger Member
   Coach: [coach name]
   Status: active

============================================================
📊 Test Summary
============================================================
✅ Coach Auto-Profile
✅ Member Auto-Profile

Result: 2/2 tests passed

🎉 SUCCESS! Auth trigger is working correctly!
   Profiles are being automatically created on signup.
```

## Step 4: Update Frontend Code (Optional)

Once the trigger is working, you can remove the manual profile creation code from your frontend. The `AuthContext.tsx` can be simplified because profiles will be created automatically.

### Before (Manual Creation)
```typescript
// After signup, manually create profile
await supabase.from('coaches').insert({
  id: user.id,
  email: user.email,
  // ... other fields
});
```

### After (Automatic)
```typescript
// Just sign up - profile created automatically!
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: 'coach',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      brandSlug: 'john-doe'
    }
  }
});
// Profile is created automatically by trigger
```

## Troubleshooting

### Trigger Not Working?

If the test fails, check:

1. **Was the SQL executed successfully?**
   - Go to SQL Editor and run: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
   - Should return one row

2. **Does the function exist?**
   - Run: `SELECT routine_name FROM information_schema.routines WHERE routine_name = 'handle_new_user';`
   - Should return one row

3. **Check trigger execution**
   - Create a test user manually and check if profile appears
   - Check Supabase logs for any errors

### Manual Re-apply

If something went wrong, you can re-apply the trigger:

1. The SQL file uses `CREATE OR REPLACE FUNCTION` and `DROP TRIGGER IF EXISTS`
2. So it's safe to run multiple times
3. Just run the entire `apply-auth-trigger.sql` file again

## What This Trigger Does

When a user signs up via `supabase.auth.signUp()`:

1. **Supabase Auth** creates the user in `auth.users`
2. **Trigger fires** immediately after user creation
3. **Trigger reads** metadata from `raw_user_meta_data.role`
4. **Creates profile**:
   - If `role === 'coach'` → inserts into `coaches` table
   - If `role === 'member'` → inserts into `members` table (requires `coach_id`)

The trigger uses `ON CONFLICT DO NOTHING` so it's safe if the profile already exists.

## Metadata Required

### For Coach Signup
```typescript
{
  role: 'coach',           // Required
  firstName: 'John',       // Optional
  lastName: 'Doe',         // Optional
  displayName: 'John Doe', // Optional
  brandSlug: 'john-doe'    // Optional (but recommended)
}
```

### For Member Signup
```typescript
{
  role: 'member',          // Required
  coach_id: '[uuid]',      // Required
  firstName: 'Jane',       // Optional
  lastName: 'Smith'        // Optional
}
```

## Files Reference

- **apply-auth-trigger.sql** - The SQL migration to apply
- **test-auth-trigger.mjs** - Test script to verify it works
- **MIGRATION_INSTRUCTIONS.md** - Detailed migration documentation
- **PHASE3_TEST_RESULTS.md** - Complete test results and findings
