/*
  # Create Coaches Table

  1. New Tables
    - `coaches`
      - `id` (uuid, primary key) - references auth.users
      - `email` (text, unique, not null)
      - `first_name` (text)
      - `last_name` (text)
      - `display_name` (text) - public-facing name
      - `brand_slug` (text, unique) - URL-friendly brand identifier
      - `stripe_account_id` (text) - Stripe Connect account
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `coaches` table
    - Coaches can read and update their own profile
    - Public can read coach profiles (for landing pages)

  3. Notes
    - The id references auth.users to link with Supabase Auth
    - brand_slug is used for public coach landing page URLs
*/

CREATE TABLE IF NOT EXISTS coaches (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  display_name text,
  brand_slug text UNIQUE,
  stripe_account_id text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaches_brand_slug ON coaches(brand_slug);
CREATE INDEX IF NOT EXISTS idx_coaches_email ON coaches(email);

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can read own profile"
  ON coaches FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Coaches can update own profile"
  ON coaches FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Coaches can insert own profile"
  ON coaches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can read coach profiles by brand_slug"
  ON coaches FOR SELECT
  TO anon
  USING (brand_slug IS NOT NULL);