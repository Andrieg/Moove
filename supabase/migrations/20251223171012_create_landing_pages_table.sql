/*
  # Create Landing Pages Table

  1. New Tables
    - `landing_pages`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, unique, not null) - references coaches
      - `hero_cover_image_url` (text)
      - `hero_title` (text)
      - `hero_description` (text)
      - `hero_about` (text)
      - `hero_trailer_video_url` (text) - YouTube/Vimeo URL
      - `access_cover_image_url` (text)
      - `access_title` (text)
      - `access_description` (text)
      - `show_reviews` (boolean)
      - `show_membership` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `landing_pages` table
    - Coaches can CRUD their own landing page
    - Public can read landing pages (for coach websites)

  3. Notes
    - One landing page per coach (unique coach_id)
    - trailer_video_url supports YouTube/Vimeo embeds
*/

CREATE TABLE IF NOT EXISTS landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid UNIQUE NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  hero_cover_image_url text,
  hero_title text,
  hero_description text,
  hero_about text,
  hero_trailer_video_url text,
  access_cover_image_url text,
  access_title text,
  access_description text,
  show_reviews boolean DEFAULT true,
  show_membership boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_coach_id ON landing_pages(coach_id);

ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can read own landing page"
  ON landing_pages FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can insert own landing page"
  ON landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update own landing page"
  ON landing_pages FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can delete own landing page"
  ON landing_pages FOR DELETE
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Public can read landing pages"
  ON landing_pages FOR SELECT
  TO anon
  USING (true);