/*
  # Create Member Progress Table

  1. New Tables
    - `member_progress`
      - `id` (uuid, primary key)
      - `member_id` (uuid, not null) - references members
      - `video_id` (uuid) - references videos (nullable)
      - `challenge_id` (uuid) - references challenges (nullable)
      - `completed` (boolean) - whether fully completed
      - `progress_seconds` (integer) - watch progress
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `member_progress` table
    - Members can CRUD their own progress
    - Coaches can read their members' progress

  3. Notes
    - Tracks both video watch progress and challenge completion
    - video_id tracks individual video progress
    - challenge_id tracks overall challenge enrollment/completion
*/

CREATE TABLE IF NOT EXISTS member_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  progress_seconds integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(member_id, video_id),
  UNIQUE(member_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_member_progress_member_id ON member_progress(member_id);
CREATE INDEX IF NOT EXISTS idx_member_progress_video_id ON member_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_member_progress_challenge_id ON member_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_member_progress_completed ON member_progress(completed);

ALTER TABLE member_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own progress"
  ON member_progress FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can insert own progress"
  ON member_progress FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can update own progress"
  ON member_progress FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid())
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can delete own progress"
  ON member_progress FOR DELETE
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Coaches can read their members progress"
  ON member_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      JOIN coaches ON coaches.id = members.coach_id
      WHERE members.id = member_progress.member_id
      AND coaches.id = auth.uid()
    )
  );