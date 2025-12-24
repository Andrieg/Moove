import { supabase } from "./supabase";
import type { Video, Challenge } from "@moove/types";

export interface VideoCreate {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  category?: string;
  target?: string;
  fitness_goal?: string;
  published?: boolean;
  featured?: boolean;
}

export interface VideoUpdate {
  title?: string;
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  category?: string;
  target?: string;
  fitness_goal?: string;
  published?: boolean;
  featured?: boolean;
}

export interface ChallengeCreate {
  title: string;
  description?: string;
  cover_image_url?: string;
  status?: 'scheduled' | 'started' | 'completed';
  start_date?: string;
  end_date?: string;
}

export interface ChallengeUpdate {
  title?: string;
  description?: string;
  cover_image_url?: string;
  status?: 'scheduled' | 'started' | 'completed';
  start_date?: string;
  end_date?: string;
}

export interface MemberProgressCreate {
  video_id?: string;
  challenge_id?: string;
  completed?: boolean;
  progress_seconds?: number;
}

export interface MemberProgressUpdate {
  completed?: boolean;
  progress_seconds?: number;
  completed_at?: string;
}

function extractVideoInfo(url: string): { platform: string | null; videoId: string | null } {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = null;
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v');
      }
      return { platform: 'youtube', videoId };
    }

    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      return { platform: 'vimeo', videoId: videoId || null };
    }

    return { platform: null, videoId: null };
  } catch {
    return { platform: null, videoId: null };
  }
}

export const videosService = {
  async create(video: VideoCreate) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { platform, videoId } = extractVideoInfo(video.video_url);

    const { data, error } = await supabase
      .from('videos')
      .insert({
        coach_id: user.id,
        title: video.title,
        description: video.description,
        video_url: video.video_url,
        video_platform: platform,
        video_id: videoId,
        thumbnail_url: video.thumbnail_url,
        duration_seconds: video.duration_seconds,
        category: video.category,
        target: video.target,
        fitness_goal: video.fitness_goal,
        published: video.published ?? false,
        featured: video.featured ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: VideoUpdate) {
    const updateData: any = { ...updates };

    if (updates.video_url) {
      const { platform, videoId } = extractVideoInfo(updates.video_url);
      updateData.video_platform = platform;
      updateData.video_id = videoId;
    }

    const { data, error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPublishedByCoach(coachId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('coach_id', coachId)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

export const challengesService = {
  async create(challenge: ChallengeCreate) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        coach_id: user.id,
        title: challenge.title,
        description: challenge.description,
        cover_image_url: challenge.cover_image_url,
        status: challenge.status ?? 'scheduled',
        start_date: challenge.start_date,
        end_date: challenge.end_date,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ChallengeUpdate) {
    const { data, error } = await supabase
      .from('challenges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getByCoach(coachId: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('coach_id', coachId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addVideos(challengeId: string, videoIds: string[]) {
    const videosToAdd = videoIds.map((videoId, index) => ({
      challenge_id: challengeId,
      video_id: videoId,
      day_number: index + 1,
    }));

    const { error } = await supabase
      .from('challenge_videos')
      .insert(videosToAdd);

    if (error) throw error;
  },

  async removeVideo(challengeId: string, videoId: string) {
    const { error } = await supabase
      .from('challenge_videos')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('video_id', videoId);

    if (error) throw error;
  },

  async getChallengeVideos(challengeId: string) {
    const { data, error } = await supabase
      .from('challenge_videos')
      .select(`
        day_number,
        video_id,
        videos (
          id,
          title,
          duration_seconds,
          thumbnail_url,
          video_url
        )
      `)
      .eq('challenge_id', challengeId)
      .order('day_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

export const memberProgressService = {
  async createOrUpdate(progress: MemberProgressCreate & { member_id?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const memberId = progress.member_id || user.id;

    const { data, error } = await supabase
      .from('member_progress')
      .upsert({
        member_id: memberId,
        video_id: progress.video_id,
        challenge_id: progress.challenge_id,
        completed: progress.completed ?? false,
        progress_seconds: progress.progress_seconds ?? 0,
        completed_at: progress.completed ? new Date().toISOString() : null,
      }, {
        onConflict: progress.video_id ? 'member_id,video_id' : 'member_id,challenge_id',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVideoProgress(videoId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('member_progress')
      .select('*')
      .eq('member_id', user.id)
      .eq('video_id', videoId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getChallengeProgress(challengeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('member_progress')
      .select('*')
      .eq('member_id', user.id)
      .eq('challenge_id', challengeId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('member_progress')
      .select('*')
      .eq('member_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMemberProgressByCoach() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('member_progress')
      .select(`
        *,
        members (
          id,
          email,
          full_name
        ),
        videos (
          id,
          title
        ),
        challenges (
          id,
          title
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
