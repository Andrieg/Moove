/*
  # Create Challenges Table

  1. New Tables
    - `challenges`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, not null) - references coaches
      - `title` (text, not null)
      - `description` (text)
      - `cover_image_url` (text)
      - `status` (text) - scheduled/started/completed
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `challenges` table
    - Coaches can CRUD their own challenges
    - Members can read challenges from their coach

  3. Notes
    - Challenges contain videos linked via junction table
    - Status is computed based on dates but can be overridden
*/

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cover_image_url text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'started', 'completed')),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenges_coach_id ON challenges(coach_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_start_date ON challenges(start_date);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can read own challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can insert own challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update own challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can delete own challenges"
  ON challenges FOR DELETE
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Members can read challenges from their coach"
  ON challenges FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.coach_id = challenges.coach_id
    )
  );