-- ============================================================
-- APPLY THIS MIGRATION IN SUPABASE DASHBOARD
-- ============================================================
-- Navigate to: SQL Editor in your Supabase Dashboard
-- Copy this entire file and run it
-- ============================================================

/*
  # Create Auth Profile Trigger

  This migration enables automatic profile creation when users sign up.

  When a user signs up via Supabase Auth with metadata containing 'role',
  this trigger automatically creates the corresponding profile in either
  the coaches or members table.
*/

-- Create the trigger function
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

-- Verify the trigger was created
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
