/*
  # Create Subscriptions Table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `member_id` (uuid, not null) - references members
      - `membership_id` (uuid, not null) - references memberships
      - `coach_id` (uuid, not null) - references coaches
      - `stripe_subscription_id` (text) - Stripe subscription ID
      - `stripe_customer_id` (text) - Stripe customer ID
      - `status` (text) - active/paused/cancelled/past_due
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `subscriptions` table
    - Members can read their own subscription
    - Coaches can read their members' subscriptions

  3. Notes
    - Links members to membership tiers via Stripe
    - Tracks billing period and cancellation status
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  membership_id uuid NOT NULL REFERENCES memberships(id) ON DELETE RESTRICT,
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(member_id, membership_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_membership_id ON subscriptions(membership_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_coach_id ON subscriptions(coach_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Coaches can read their members subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "System can insert subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "System can update subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid())
  WITH CHECK (member_id = auth.uid());