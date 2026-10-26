'use client';

import { useState, useEffect, use } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { Play, Calendar, Film, Loader2 } from 'lucide-react';

export default function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === 'success' && data.movie) {
          setMovie(data.movie);
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết phim:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0c] text-[#ff0b3a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-400 text-lg">Không tìm thấy thông tin phim từ NGUỒN C!</p>
        <Link href="/" className="px-5 py-2 bg-[#ff0b3a] text-white font-bold rounded-xl text-sm">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  const firstEpisode = movie.episodes?.[0]?.items?.[0];

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />

        <div className="relative w-full h-[45vh] lg:h-[60vh]">
          <img
            src={movie.poster_url || movie.thumb_url}
            alt={movie.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0c] via-[#0d0d0c]/60 to-transparent" />
        </div>

        <div className="p-4 sm:p-8 -mt-28 relative z-10 max-w-5xl space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={movie.thumb_url || movie.poster_url}
              alt={movie.name}
              className="w-44 h-64 object-cover rounded-xl shadow-2xl border border-zinc-800 shrink-0"
            />
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-white">{movie.name}</h1>
              <p className="text-lg text-gray-400 font-medium">{movie.original_name}</p>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-[#ff0b3a] px-3 py-1 rounded-md font-bold">{movie.quality || 'HD'}</span>
                <span className="bg-zinc-800 px-3 py-1 rounded-md font-bold">{movie.language || 'Vietsub'}</span>
                {movie.year && (
                  <span className="bg-zinc-800 px-3 py-1 rounded-md flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {movie.year}
                  </span>
                )}
              </div>

              {firstEpisode && (
                <Link
                  href={`/xem-phim/${movie.slug}/${firstEpisode.slug}`}
                  className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-[#ff0b3a] text-white font-bold text-base hover:bg-red-700 transition shadow-lg shadow-[#ff0b3a]/30"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Xem Phim Ngay</span>
                </Link>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-[#ff0b3a]" /> Nội Dung Phim
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {movie.description || 'Đang cập nhật nội dung...'}
            </p>
          </div>

          {movie.episodes && movie.episodes.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-800/80">
              <h2 className="text-xl font-bold text-white">Danh Sách Tập</h2>
              {movie.episodes.map((server: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs text-gray-400 font-semibold">{server.server_name}</p>
                  <div className="flex flex-wrap gap-2">
                    {(server.items || []).map((ep: any) => (
                      <Link
                        key={ep.slug}
                        href={`/xem-phim/${movie.slug}/${ep.slug}`}
                        className="px-4 py-2 bg-zinc-800 hover:bg-[#ff0b3a] hover:text-white text-gray-200 text-xs font-semibold rounded-lg transition"
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