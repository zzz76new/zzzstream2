'use client';

import React from 'react';
import { isValidEmbedUrl } from '@/lib/security';

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
}

export default function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  if (!isValidEmbedUrl(embedUrl)) {
    return (
      <div className="w-full aspect-video bg-neutral-900 border border-red-500/30 flex flex-col items-center justify-center rounded-xl text-red-400 p-4">
        <p className="font-semibold">Nguồn phát phim không an toàn hoặc link bị lỗi!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}

