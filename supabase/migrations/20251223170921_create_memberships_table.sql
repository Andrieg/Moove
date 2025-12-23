/*
  # Create Memberships Table

  1. New Tables
    - `memberships`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, not null) - references coaches
      - `title` (text, not null)
      - `description` (text)
      - `price_monthly` (numeric) - monthly price
      - `currency` (text) - default GBP
      - `benefits` (text[]) - array of benefit strings
      - `stripe_price_id` (text) - Stripe price ID
      - `status` (text) - active/inactive
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `memberships` table
    - Coaches can CRUD their own memberships
    - Public can read active memberships (for landing pages)

  3. Notes
    - Each coach can have multiple membership tiers
    - stripe_price_id links to Stripe for payments
*/

CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price_monthly numeric(10,2) NOT NULL,
  currency text DEFAULT 'GBP',
  benefits text[] DEFAULT '{}',
  stripe_price_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memberships_coach_id ON memberships(coach_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can read own memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can insert own memberships"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update own memberships"
  ON memberships FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can delete own memberships"
  ON memberships FOR DELETE
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Public can read active memberships"
  ON memberships FOR SELECT
  TO anon
  USING (status = 'active');