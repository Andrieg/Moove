/*
  # Create Videos Table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, not null) - references coaches
      - `title` (text, not null)
      - `description` (text)
      - `video_url` (text, not null) - YouTube or Vimeo URL
      - `video_platform` (text) - 'youtube' or 'vimeo'
      - `video_id` (text) - extracted platform video ID
      - `thumbnail_url` (text) - auto-fetched or custom thumbnail
      - `duration_seconds` (integer)
      - `category` (text) - workout category
      - `target` (text) - body target area
      - `fitness_goal` (text)
      - `published` (boolean) - visibility
      - `featured` (boolean) - highlight on landing page
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `videos` table
    - Coaches can CRUD their own videos
    - Members can read videos from their coach

  3. Notes
    - video_url stores the full YouTube/Vimeo URL
    - video_platform and video_id are extracted for embedding
    - No file storage needed - uses embedded players
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  video_platform text CHECK (video_platform IN ('youtube', 'vimeo')),
  video_id text,
  thumbnail_url text,
  duration_seconds integer,
  category text,
  target text,
  fitness_goal text,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_videos_coach_id ON videos(coach_id);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can read own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    coach_id = auth.uid()
  );

CREATE POLICY "Coaches can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Members can read published videos from their coach"
  ON videos FOR SELECT
  TO authenticated
  USING (
    published = true
    AND EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.coach_id = videos.coach_id
    )
  );