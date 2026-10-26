'use client';

import { useState, useEffect, use } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MovieCard from '@/components/MovieCard';
import { UnifiedMovie } from '@/types/movie';
import { Loader2 } from 'lucide-react';

export default function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [movies, setMovies] = useState<UnifiedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenre() {
      try {
        setLoading(true);
        const res = await fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=1`, {
          cache: 'no-store',
        });
        if (!res.ok) return;

        const json = await res.json();
        const items = json.items || [];

        const formatted = items.map((item: any) => ({
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

        setMovies(formatted);
      } catch (err) {
        console.error('Lỗi lấy thể loại:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGenre();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />
        <main className="p-4 sm:p-8 space-y-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2 capitalize">
            <span className="w-2 h-6 bg-[#e10111] rounded-full" />
            <span>Phim Thể Loại: {slug.replace(/-/g, ' ')}</span>
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#e10111] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}