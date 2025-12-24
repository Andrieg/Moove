"use client";

import { useEffect, useRef, useState } from "react";

interface EmbeddedVideoPlayerProps {
  videoUrl: string;
  platform?: string | null;
  videoId?: string | null;
  thumbnailUrl?: string | null;
  title?: string;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
  autoplay?: boolean;
  className?: string;
}

export default function EmbeddedVideoPlayer({
  videoUrl,
  platform,
  videoId,
  thumbnailUrl,
  title,
  onProgress,
  onComplete,
  autoplay = false,
  className = "",
}: EmbeddedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const extractVideoInfo = (url: string) => {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let id = null;
        if (urlObj.hostname.includes('youtu.be')) {
          id = urlObj.pathname.slice(1);
        } else {
          id = urlObj.searchParams.get('v');
        }
        return { platform: 'youtube', videoId: id };
      }

      if (urlObj.hostname.includes('vimeo.com')) {
        const id = urlObj.pathname.split('/').filter(Boolean).pop();
        return { platform: 'vimeo', videoId: id || null };
      }

      return { platform: null, videoId: null };
    } catch {
      return { platform: null, videoId: null };
    }
  };

  const info = platform && videoId
    ? { platform, videoId }
    : extractVideoInfo(videoUrl);

  useEffect(() => {
    if (isPlaying && onProgress) {
      intervalRef.current = setInterval(() => {
        onProgress(Math.floor(Date.now() / 1000));
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, onProgress]);

  if (!info.platform || !info.videoId) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-600 font-medium">Invalid Video URL</p>
          <p className="text-sm text-slate-400 mt-1">
            Please provide a valid YouTube or Vimeo URL
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-600 font-medium">Failed to Load Video</p>
          <p className="text-sm text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const getEmbedUrl = () => {
    if (info.platform === 'youtube') {
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        rel: '0',
        modestbranding: '1',
      });
      return `https://www.youtube.com/embed/${info.videoId}?${params.toString()}`;
    }

    if (info.platform === 'vimeo') {
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        title: '0',
        byline: '0',
        portrait: '0',
      });
      return `https://player.vimeo.com/video/${info.videoId}?${params.toString()}`;
    }

    return '';
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {!isPlaying && thumbnailUrl ? (
        <div
          className="relative cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={thumbnailUrl}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white transition flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <iframe
            src={getEmbedUrl()}
            title={title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            onLoad={() => setIsPlaying(true)}
            onError={() => setError('Failed to load video player')}
          />
        </div>
      )}
    </div>
  );
}
