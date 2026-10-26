'use client';

interface SafePlayerProps {
  embedUrl: string;
  title?: string;
}

export default function SafePlayer({ embedUrl, title }: SafePlayerProps) {
  if (!embedUrl) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
        <p className="text-zinc-400 text-sm">Đang tải video hoặc chưa có nguồn phát...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
      <iframe
        src={embedUrl}
        title={title || 'Trình phát phim'}
        className="w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}