/*
  # Create Members Table

  1. New Tables
    - `members`
      - `id` (uuid, primary key) - references auth.users
      - `coach_id` (uuid, not null) - references coaches
      - `email` (text, unique, not null)
      - `first_name` (text)
      - `last_name` (text)
      - `avatar_url` (text)
      - `dob` (date) - date of birth
      - `gender` (text)
      - `fitness_goal` (text)
      - `weight_kg` (numeric)
      - `height_cm` (numeric)
      - `status` (text) - active/inactive
      - `last_activity_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `members` table
    - Members can read and update their own profile
    - Coaches can read their members' profiles

  3. Notes
    - Each member belongs to exactly one coach
    - Status tracks if member is actively subscribed
*/

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  dob date,
  gender text,
  fitness_goal text,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_activity_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_members_coach_id ON members(coach_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own profile"
  ON members FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Members can update own profile"
  ON members FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Members can insert own profile"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Coaches can read their members"
  ON members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coaches
      WHERE coaches.id = members.coach_id
      AND coaches.id = auth.uid()
    )
  );