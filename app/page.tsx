'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MovieCard from '@/components/MovieCard';
import { UnifiedMovie } from '@/types/movie';
import { Play, Info, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [latestMovies, setLatestMovies] = useState<UnifiedMovie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<UnifiedMovie[]>([]);
  const [singleMovies, setSingleMovies] = useState<UnifiedMovie[]>([]);
  const [heroMovie, setHeroMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);

        const [resLatest, resSeries, resSingle] = await Promise.all([
          fetch('https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=1', { cache: 'no-store' }),
          fetch('https://phim.nguonc.com/api/films/danh-sach/phim-bo?page=1', { cache: 'no-store' }),
          fetch('https://phim.nguonc.com/api/films/danh-sach/phim-le?page=1', { cache: 'no-store' }),
        ]);

        const formatItems = (items: any[]) =>
          (items || []).map((item) => ({
            id: item.slug,
            name: item.name,
            originName: item.original_name || item.origin_name || '',
            slug: item.slug,
            posterUrl: item.poster_url || item.thumb_url || '',
            thumbUrl: item.thumb_url || item.poster_url || '',
            year: item.year || '',
            quality: item.quality || 'HD',
            lang: item.language || item.lang || 'Vietsub',
          }));

        if (resLatest.ok) {
          const data = await resLatest.json();
          const items = data.items || [];
          setLatestMovies(formatItems(items));
          if (items.length > 0) setHeroMovie(items[0]);
        }

        if (resSeries.ok) {
          const data = await resSeries.json();
          setSeriesMovies(formatItems(data.items || []));
        }

        if (resSingle.ok) {
          const data = await resSingle.json();
          setSingleMovies(formatItems(data.items || []));
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
            <Loader2 className="w-10 h-10 text-[#e10111] animate-spin" />
            <p className="text-xs text-zinc-400 font-medium">Đang tải kho phim StreamX...</p>
          </div>
        ) : (
          <main className="space-y-8 p-4 sm:p-6 lg:p-8">
            {heroMovie && (
              <section className="relative w-full h-[360px] sm:h-[450px] rounded-3xl overflow-hidden border border-[#2a2a2a] shadow-2xl">
                <img
                  src={heroMovie.poster_url || heroMovie.thumb_url}
                  alt={heroMovie.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0c] via-[#0d0d0c]/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e10111]/90 text-white text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>TRENDING NOW</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                    {heroMovie.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2">
                    {heroMovie.original_name} • {heroMovie.year} • {heroMovie.quality || 'HD'}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    {/* Bấm Xem Ngay chuyển trực tiếp vào tập 1 phát video */}
                    <Link
                      href={`/xem-phim/${heroMovie.slug}/tap-1`}
                      className="px-6 py-2.5 bg-[#e10111] hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-[#e10111]/40 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Xem Ngay</span>
                    </Link>
                    <Link
                      href={`/phim/${heroMovie.slug}`}
                      className="px-5 py-2.5 bg-[#1c1b1b]/80 hover:bg-[#2a2a2a] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-[#353534] transition active:scale-95"
                    >
                      <Info className="w-4 h-4" />
                      <span>Chi Tiết</span>
                    </Link>
                  </div>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                <span className="w-2 h-6 bg-[#e10111] rounded-full" />
                <span>Phim Mới Cập Nhật</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {latestMovies.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                <span className="w-2 h-6 bg-[#e10111] rounded-full" />
                <span>Phim Bộ Nổi Bật</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {seriesMovies.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                <span className="w-2 h-6 bg-[#e10111] rounded-full" />
                <span>Phim Lẻ Bắt Mắt</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {singleMovies.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          </main>
        )}
      </div>
      <BottomNav />
    </div>
  );
}