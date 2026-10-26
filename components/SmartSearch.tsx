'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X, Film } from 'lucide-react';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Đóng dropdown gợi ý khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lấy dữ liệu gợi ý trực tiếp khi gõ từ 2 ký tự
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(trimmedQuery)}&page=1`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success') {
            setResults(json.items || []);
          } else {
            setResults([]);
          }
        }
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Xử lý khi bấm phím ENTER hoặc bấm xem tất cả
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/tim-kiem?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-3xl mx-2 sm:mx-6">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Bạn muốn thưởng thức phim gì nè!!!"
          className="w-full bg-[#1c1b1b] text-sm sm:text-base text-white pl-12 pr-10 py-3 rounded-2xl border border-[#353534] focus:outline-none focus:border-[#e10111] focus:ring-1 focus:ring-[#e10111] transition shadow-inner placeholder:text-zinc-500 font-medium"
        />
        {loading ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e10111] animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </form>

      {/* Popup gợi ý các phim liên quan trực tiếp */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1b1b] border border-[#353534] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] overflow-hidden z-50 max-h-[450px] overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-[#e10111] animate-spin" />
              <span>Đang tra cứu kho phim...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-[#2a2a2a]">
              {results.slice(0, 6).map((item) => (
                <Link
                  key={item.slug}
                  href={`/phim/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 p-3.5 hover:bg-[#2a2a2a] transition group"
                >
                  <img
                    src={item.poster_url || item.thumb_url}
                    alt={item.name}
                    className="w-11 h-16 object-cover rounded-xl border border-[#353534] shrink-0 shadow-md"
                  />
                  <div className="flex flex-col min-w-0 flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#ffb4aa] truncate transition">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {item.original_name || item.year || 'Đang cập nhật'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-[#e10111]/20 text-[#ffb4aa] font-bold uppercase">
                        {item.quality || 'HD'}
                      </span>
                      <span className="text-zinc-400">{item.language || 'Vietsub'}</span>
                    </div>
                  </div>
                </Link>
              ))}

              <button
                onClick={() => handleSearchSubmit()}
                className="w-full py-3 text-center text-xs font-bold text-[#ffb4aa] bg-[#2a2a2a]/80 hover:bg-[#2a2a2a] transition flex items-center justify-center gap-1.5"
              >
                <span>Xem tất cả phim liên quan đến "{query}"</span>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center space-y-2">
              <Film className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">Bấm Enter để tìm kiếm toàn bộ phim khớp với "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}