'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';

export default function Home() {
  const [newMovies, setNewMovies] = useState<any[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<any[]>([]);
  const [singleMovies, setSingleMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://phimimg.com/${url}`;
  };

  useEffect(() => {
    async function fetchAllMovies() {
      try {
        setLoading(true);

        setError('');
        const response = await fetch('/api/movies', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Movies API returned ${response.status}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setNewMovies(Array.isArray(data.newMovies) ? data.newMovies : []);
        setSeriesMovies(Array.isArray(data.seriesMovies) ? data.seriesMovies : []);
        setSingleMovies(Array.isArray(data.singleMovies) ? data.singleMovies : []);
      } catch (err) {
        console.error('Movie list request failed:', err);
        setError('Could not load movies. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllMovies();
  }, []);

  const renderMovieGrid = (movies: any[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#e10111]" />
        </div>
      );
    }

    if (!movies || movies.length === 0) {
      return <p className="text-zinc-500 text-xs">Chưa có phim trong danh sách này.</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.slice(0, 10).map((movie) => (
          <Link
            key={movie._id || movie.slug}
            href={`/phim/${movie.slug}`}
            className="group bg-[#1c1b1b] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#e10111] transition flex flex-col"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
              <img
                src={getImageUrl(movie.thumb_url || movie.poster_url)}
                alt={movie.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-[#e10111] text-white flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </span>
              </div>
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-bold text-white">
                {movie.quality || 'HD'}
              </span>
            </div>

            <div className="p-3 flex flex-col flex-1 justify-between space-y-1">
              <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#e10111] transition">
                {movie.name}
              </h3>
              <p className="text-[10px] text-zinc-400 line-clamp-1">
                {movie.origin_name || movie.year}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8 space-y-10">
          {error && (
            <div role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">{error}</div>
          )}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-white border-l-4 border-[#e10111] pl-3">
              Phim Mới Cập Nhật
            </h2>
            {renderMovieGrid(newMovies)}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-white border-l-4 border-[#e10111] pl-3">
              Phim Bộ Nổi Bật
            </h2>
            {renderMovieGrid(seriesMovies)}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-white border-l-4 border-[#e10111] pl-3">
              Phim Lẻ Bắt Mắt
            </h2>
            {renderMovieGrid(singleMovies)}
          </section>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

