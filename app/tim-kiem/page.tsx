'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MovieCard from '@/components/MovieCard';
import { UnifiedMovie } from '@/types/movie';
import { Loader2, SearchX } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [movies, setMovies] = useState<UnifiedMovie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) return;

    async function fetchSearch() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(keyword.trim())}&page=1`,
          { cache: 'no-store' }
        );
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
        console.error('Lỗi tìm kiếm:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, [keyword]);

  return (
    <main className="p-4 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Kết quả tìm kiếm cho: <span className="text-[#e10111]">"{keyword}"</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Hiển thị tất cả các phim khớp hoặc liên quan đến từ khóa bạn đã gõ
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#e10111] animate-spin" />
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <SearchX className="w-12 h-12 text-zinc-600" />
          <p className="text-sm text-zinc-400">Không tìm thấy phim nào liên quan đến từ khóa "{keyword}".</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:pl-60 pb-20 lg:pb-10 min-w-0">
        <Navbar />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#e10111] animate-spin" />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
      <BottomNav />
    </div>
  );
}