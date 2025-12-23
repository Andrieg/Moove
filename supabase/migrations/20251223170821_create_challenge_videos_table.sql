/*
  # Create Challenge Videos Junction Table

  1. New Tables
    - `challenge_videos`
      - `id` (uuid, primary key)
      - `challenge_id` (uuid, not null) - references challenges
      - `video_id` (uuid, not null) - references videos
      - `day_number` (integer) - which day of the challenge
      - `sort_order` (integer) - order within the day
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `challenge_videos` table
    - Coaches can CRUD challenge_videos for their challenges
    - Members can read challenge_videos for their coach's challenges

  3. Notes
    - Links videos to specific days within a challenge
    - sort_order allows multiple videos per day
    - Unique constraint prevents duplicate video/challenge/day combos
*/

CREATE TABLE IF NOT EXISTS challenge_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  day_number integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, video_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_challenge_videos_challenge_id ON challenge_videos(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_videos_video_id ON challenge_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_challenge_videos_day ON challenge_videos(challenge_id, day_number);

ALTER TABLE challenge_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can read own challenge videos"
  ON challenge_videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_videos.challenge_id
      AND challenges.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can insert own challenge videos"
  ON challenge_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_videos.challenge_id
      AND challenges.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can update own challenge videos"
  ON challenge_videos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_videos.challenge_id
      AND challenges.coach_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_videos.challenge_id
      AND challenges.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can delete own challenge videos"
  ON challenge_videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_videos.challenge_id
      AND challenges.coach_id = auth.uid()
    )
  );

CREATE POLICY "Members can read challenge videos from their coach"
  ON challenge_videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      JOIN members ON members.coach_id = challenges.coach_id
      WHERE challenges.id = challenge_videos.challenge_id
      AND members.id = auth.uid()
    )
  );