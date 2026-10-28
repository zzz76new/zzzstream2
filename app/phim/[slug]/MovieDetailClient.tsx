'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { Play, Calendar, Film, Loader2 } from 'lucide-react';

export default function MovieDetailClient({ params }: { params?: any }) {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentSlug = params?.slug;

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/phim\/([^\/]+)/);
      if (match) {
        currentSlug = match[1].replace('.html', '').replace(/\/$/, '');
      }
    }

    if (!currentSlug || currentSlug === 'default') {
      setLoading(false);
      return;
    }

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`https://phimapi.com/phim/${currentSlug}`, { cache: 'no-store' });
        if (!res.ok) return;

        const data = await res.json();
        if (data.status && data.movie) {
          setMovie({
            ...data.movie,
            episodes: data.episodes || [],
          });
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết phim từ KKPhim:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0c] text-[#e10111] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-400 text-lg">Không tìm thấy thông tin phim!</p>
        <Link href="/" className="px-5 py-2 bg-[#e10111] text-white font-bold rounded-xl text-sm">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  const firstEpisode = movie.episodes?.[0]?.server_data?.[0];
  const firstEpSlug = firstEpisode?.slug || 'tap-1';

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />

        <div className="relative w-full h-[40vh] lg:h-[55vh]">
          <img
            src={movie.poster_url || movie.thumb_url}
            alt={movie.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0c] via-[#0d0d0c]/60 to-transparent" />
        </div>

        <div className="p-4 sm:p-8 -mt-24 relative z-10 max-w-5xl space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={movie.thumb_url || movie.poster_url}
              alt={movie.name}
              referrerPolicy="no-referrer"
              className="w-40 h-60 object-cover rounded-xl shadow-2xl border border-zinc-800 shrink-0"
            />
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-black text-white">{movie.name}</h1>
              <p className="text-base text-zinc-400 font-medium">{movie.origin_name || movie.original_name}</p>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-[#e10111] px-3 py-1 rounded-md font-bold text-white">{movie.quality || 'HD'}</span>
                <span className="bg-zinc-800 px-3 py-1 rounded-md font-bold text-zinc-200">{movie.lang || movie.language || 'Vietsub'}</span>
                {movie.year && (
                  <span className="bg-zinc-800 px-3 py-1 rounded-md flex items-center gap-1 text-zinc-200">
                    <Calendar className="w-3.5 h-3.5" /> {movie.year}
                  </span>
                )}
              </div>

              <Link
                href={`/xem-phim/${movie.slug}/${firstEpSlug}`}
                className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-[#e10111] text-white font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-[#e10111]/30 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Xem Phim Ngay</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-[#e10111]" /> Nội Dung Phim
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
              {movie.content?.replace(/<[^>]*>?/gm, '') || movie.description || 'Đang cập nhật nội dung...'}
            </p>
          </div>

          {movie.episodes && movie.episodes.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h2 className="text-lg font-bold text-white">Danh Sách Tập</h2>
              {movie.episodes.map((server: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs text-zinc-400 font-semibold">{server.server_name}</p>
                  <div className="flex flex-wrap gap-2">
                    {(server.server_data || []).map((ep: any) => (
                      <Link
                        key={ep.slug}
                        href={`/xem-phim/${movie.slug}/${ep.slug}`}
                        className="px-4 py-2 bg-zinc-800 hover:bg-[#e10111] hover:text-white text-zinc-200 text-xs font-semibold rounded-lg transition"
                      >
                        {ep.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}