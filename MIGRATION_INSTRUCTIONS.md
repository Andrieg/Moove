# Manual Migration Required: Auth Profile Trigger

## Overview

To enable automatic profile creation when users sign up, you need to apply this database migration manually.

## Why This Migration is Needed

Currently, when users sign up through Supabase Auth:
1. ✅ An entry is created in `auth.users`
2. ❌ No corresponding profile is created in `coaches` or `members` table

This means the application must manually create profiles after signup, which is error-prone.

This migration adds a database trigger that automatically creates the appropriate profile (coach or member) when a new user is created.

## Migration File

Create this file: `supabase/migrations/YYYYMMDDHHMMSS_create_auth_profile_trigger.sql`

Replace `YYYYMMDDHHMMSS` with the current timestamp (e.g., `20241224120000`)

```sql
/*
  # Create Auth Profile Trigger

  1. Purpose
    - Automatically create coach or member profile when user signs up
    - Reads user.raw_user_meta_data.role to determine profile type
    - Ensures seamless onboarding experience

  2. Changes
    - Create trigger function handle_new_user()
    - Create trigger on auth.users table
    - Function creates profile in coaches or members table based on role

  3. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only creates profiles for authenticated users
    - Validates role before creating profile

  4. Notes
    - Members require coach_id which can be set during registration
    - If no coach_id is provided for member, they will need to be assigned later
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
  user_coach_id uuid;
  user_first_name text;
  user_last_name text;
  user_display_name text;
  user_brand_slug text;
BEGIN
  -- Extract metadata from the new user
  user_role := NEW.raw_user_meta_data->>'role';
  user_coach_id := (NEW.raw_user_meta_data->>'coach_id')::uuid;
  user_first_name := NEW.raw_user_meta_data->>'firstName';
  user_last_name := NEW.raw_user_meta_data->>'lastName';
  user_display_name := NEW.raw_user_meta_data->>'displayName';
  user_brand_slug := NEW.raw_user_meta_data->>'brandSlug';

  -- Create coach profile
  IF user_role = 'coach' THEN
    INSERT INTO public.coaches (
      id,
      email,
      first_name,
      last_name,
      display_name,
      brand_slug,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(user_first_name, ''),
      COALESCE(user_last_name, ''),
      COALESCE(user_display_name, user_first_name || ' ' || user_last_name),
      user_brand_slug,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;

  -- Create member profile (only if coach_id is provided)
  ELSIF user_role = 'member' THEN
    IF user_coach_id IS NOT NULL THEN
      INSERT INTO public.members (
        id,
        email,
        coach_id,
        first_name,
        last_name,
        status,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        NEW.email,
        user_coach_id,
        COALESCE(user_first_name, ''),
        COALESCE(user_last_name, ''),
        'active',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## How to Apply This Migration

### Option 1: Using Supabase CLI (Recommended)

```bash
# Navigate to your project root
cd /path/to/project

# Create the migration file
supabase migration new create_auth_profile_trigger

# Copy the SQL content above into the new migration file

# Apply the migration
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Paste the SQL content above
5. Click **Run**

### Option 3: Using psql

```bash
psql <your-database-connection-string> -f supabase/migrations/YYYYMMDDHHMMSS_create_auth_profile_trigger.sql
```

## Frontend Requirements

For the trigger to work correctly, your frontend signup calls must pass metadata:

### Coach Registration

```typescript
await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      role: 'coach',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe Fitness',
      brandSlug: 'john-doe-fitness'  // Must be unique!
    }
  }
});
```

### Member Registration

```typescript
await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      role: 'member',
      coach_id: coachUuid,  // Required!
      firstName: 'Jane',
      lastName: 'Smith'
    }
  }
});
```

## Verification

After applying the migration, test it:

```typescript
// Test coach signup
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123',
  options: {
    data: {
      role: 'coach',
      firstName: 'Test',
      lastName: 'Coach',
      displayName: 'Test Coach',
      brandSlug: 'test-coach'
    }
  }
});

// Verify profile was created
const { data: profile } = await supabase
  .from('coaches')
  .select('*')
  .eq('id', data.user.id)
  .single();

console.log('Profile created:', profile);
```

## Rollback

If you need to remove this trigger:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

## Notes

- The trigger uses `ON CONFLICT (id) DO NOTHING` to prevent duplicate entries
- If a coach doesn't provide `brandSlug`, it will be null (they can set it later)
- Members MUST have a `coach_id` or they won't be created automatically
- All metadata fields are optional except `role` and `coach_id` (for members)
