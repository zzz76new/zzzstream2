import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MovieCard from '@/components/MovieCard';
import { getMovies } from '@/lib/api';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

export default async function HomePage() {
  const [latestMovies, seriesMovies, singleMovies] = await Promise.all([
    getMovies('phim-moi-cap-nhat'),
    getMovies('phim-bo'),
    getMovies('phim-le'),
  ]);

  const heroMovie = latestMovies[0];

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10">
        <Navbar />

        {/* Hero Section */}
        {heroMovie && (
          <section className="relative w-full h-[60vh] lg:h-[75vh] flex items-end">
            <div className="absolute inset-0 z-0">
              <img
                src={heroMovie.thumbUrl || heroMovie.posterUrl}
                alt={heroMovie.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0c] via-[#0d0d0c]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0c] via-[#0d0d0c]/60 to-transparent" />
            </div>

            <div className="relative z-10 p-4 sm:p-8 max-w-2xl space-y-3">
              <span className="bg-[#ff0b3a] text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase">
                Trending Now
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {heroMovie.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                {heroMovie.originName} • {heroMovie.year} • {heroMovie.quality}
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <Link
                  href={`/phim/${heroMovie.slug}`}
                  className="min-h-[48px] px-6 rounded-xl bg-[#ff0b3a] text-white font-bold text-sm flex items-center space-x-2 hover:bg-red-700 transition shadow-lg shadow-[#ff0b3a]/30"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Xem Ngay</span>
                </Link>
                <Link
                  href={`/phim/${heroMovie.slug}`}
                  className="min-h-[48px] px-5 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-md text-white font-bold text-sm flex items-center space-x-2 border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Chi Tiết</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Carousels / Lists */}
        <main className="p-4 sm:p-8 space-y-8 -mt-6 relative z-20">
          {/* Row 1: Mới cập nhật */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span className="w-1.5 h-5 bg-[#ff0b3a] rounded-full" />
              <span>Phim Mới Cập Nhật</span>
            </h2>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {latestMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>

          {/* Row 2: Phim Bộ */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span className="w-1.5 h-5 bg-[#ff0b3a] rounded-full" />
              <span>Phim Bộ Nổi Bật</span>
            </h2>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {seriesMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>

          {/* Row 3: Phim Lẻ */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span className="w-1.5 h-5 bg-[#ff0b3a] rounded-full" />
              <span>Phim Lẻ Bắt Mắt</span>
            </h2>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {singleMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}